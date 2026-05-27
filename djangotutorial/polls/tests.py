"""
Unit tests for the polls application.

Test coverage:
- Question model: creation, __str__, was_published_recently()
- Choice model: creation, __str__, vote counting
- Index view: empty state, published questions, future questions excluded
- Detail view: valid question, non-existent question (404)
- Results view: vote counts display, non-existent question (404)
- Vote view: successful vote, missing choice, invalid choice
"""

import datetime

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from .models import Choice, Question


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def create_question(question_text, days):
    """
    Create a Question with pub_date offset by *days* from now.
    Negative days → past, positive days → future.
    """
    pub_date = timezone.now() + datetime.timedelta(days=days)
    return Question.objects.create(question_text=question_text, pub_date=pub_date)


def add_choice(question, choice_text, votes=0):
    """Create a Choice linked to *question*."""
    return Choice.objects.create(
        question=question, choice_text=choice_text, votes=votes
    )


# ---------------------------------------------------------------------------
# Model tests
# ---------------------------------------------------------------------------

class QuestionModelTest(TestCase):
    """Tests for the Question model."""

    def test_str_returns_question_text(self):
        """__str__ should return the question text."""
        q = create_question("What is Django?", days=-1)
        self.assertEqual(str(q), "What is Django?")

    def test_was_published_recently_with_future_question(self):
        """was_published_recently() returns False for future questions."""
        future_question = create_question("Future question?", days=30)
        self.assertFalse(future_question.was_published_recently())

    def test_was_published_recently_with_old_question(self):
        """was_published_recently() returns False for questions older than 1 day."""
        old_question = create_question("Old question?", days=-2)
        self.assertFalse(old_question.was_published_recently())

    def test_was_published_recently_with_recent_question(self):
        """was_published_recently() returns True for questions published within the last day."""
        recent_question = create_question("Recent question?", days=0)
        self.assertTrue(recent_question.was_published_recently())

    def test_question_creation_stores_text(self):
        """A newly created question stores its text correctly."""
        q = create_question("Test question?", days=-1)
        self.assertEqual(q.question_text, "Test question?")

    def test_question_pub_date_is_in_past(self):
        """A past question has a pub_date before now."""
        q = create_question("Past question?", days=-5)
        self.assertLess(q.pub_date, timezone.now())


class ChoiceModelTest(TestCase):
    """Tests for the Choice model."""

    def setUp(self):
        self.question = create_question("Favourite colour?", days=-1)

    def test_str_returns_choice_text(self):
        """__str__ should return the choice text."""
        choice = add_choice(self.question, "Blue")
        self.assertEqual(str(choice), "Blue")

    def test_default_votes_is_zero(self):
        """A newly created choice starts with 0 votes."""
        choice = add_choice(self.question, "Red")
        self.assertEqual(choice.votes, 0)

    def test_vote_increment(self):
        """Manually incrementing votes persists correctly."""
        choice = add_choice(self.question, "Green")
        choice.votes += 1
        choice.save()
        choice.refresh_from_db()
        self.assertEqual(choice.votes, 1)

    def test_choice_linked_to_question(self):
        """A choice is linked to the correct question."""
        choice = add_choice(self.question, "Yellow")
        self.assertEqual(choice.question, self.question)

    def test_question_can_have_multiple_choices(self):
        """A question can have multiple choices."""
        add_choice(self.question, "A")
        add_choice(self.question, "B")
        add_choice(self.question, "C")
        self.assertEqual(self.question.choice_set.count(), 3)

    def test_deleting_question_cascades_to_choices(self):
        """Deleting a question also deletes its choices (CASCADE)."""
        add_choice(self.question, "Option 1")
        question_id = self.question.pk
        self.question.delete()
        self.assertEqual(Choice.objects.filter(question_id=question_id).count(), 0)


# ---------------------------------------------------------------------------
# View tests — Index
# ---------------------------------------------------------------------------

class IndexViewTest(TestCase):
    """Tests for the polls index view."""

    def test_no_questions(self):
        """Index view with no questions returns the empty-state message."""
        response = self.client.get(reverse("polls:index"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "No polls available.")

    def test_past_question_appears(self):
        """A past question is shown on the index page."""
        create_question("Past question?", days=-1)
        response = self.client.get(reverse("polls:index"))
        self.assertContains(response, "Past question?")

    def test_future_question_excluded(self):
        """A future question is NOT shown on the index page."""
        create_question("Future question?", days=5)
        response = self.client.get(reverse("polls:index"))
        self.assertContains(response, "No polls available.")

    def test_mixed_questions_only_past_shown(self):
        """With both past and future questions, only the past one appears."""
        create_question("Past question?", days=-1)
        create_question("Future question?", days=5)
        response = self.client.get(reverse("polls:index"))
        self.assertContains(response, "Past question?")
        self.assertNotContains(response, "Future question?")

    def test_index_shows_at_most_five_questions(self):
        """The index page shows at most 5 questions."""
        for i in range(7):
            create_question(f"Question {i}?", days=-i)
        response = self.client.get(reverse("polls:index"))
        # The response body contains question texts separated by commas
        displayed = response.content.decode().count("Question")
        self.assertLessEqual(displayed, 5)


# ---------------------------------------------------------------------------
# View tests — Detail
# ---------------------------------------------------------------------------

class DetailViewTest(TestCase):
    """Tests for the polls detail view."""

    def test_existing_question_returns_200(self):
        """Detail view returns 200 for an existing question."""
        q = create_question("What is Python?", days=-1)
        response = self.client.get(reverse("polls:detail", args=(q.pk,)))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "What is Python?")

    def test_nonexistent_question_returns_404(self):
        """Detail view returns 404 for a question that does not exist."""
        response = self.client.get(reverse("polls:detail", args=(9999,)))
        self.assertEqual(response.status_code, 404)

    def test_detail_shows_choices(self):
        """Detail view lists the choices for a question."""
        q = create_question("Favourite OS?", days=-1)
        add_choice(q, "Linux")
        add_choice(q, "macOS")
        response = self.client.get(reverse("polls:detail", args=(q.pk,)))
        self.assertContains(response, "Linux")
        self.assertContains(response, "macOS")


# ---------------------------------------------------------------------------
# View tests — Results
# ---------------------------------------------------------------------------

class ResultsViewTest(TestCase):
    """Tests for the polls results view."""

    def test_existing_question_returns_200(self):
        """Results view returns 200 for an existing question."""
        q = create_question("Best framework?", days=-1)
        response = self.client.get(reverse("polls:results", args=(q.pk,)))
        self.assertEqual(response.status_code, 200)

    def test_nonexistent_question_returns_404(self):
        """Results view returns 404 for a non-existent question."""
        response = self.client.get(reverse("polls:results", args=(9999,)))
        self.assertEqual(response.status_code, 404)

    def test_results_show_vote_counts(self):
        """Results view shows each choice with its vote count."""
        q = create_question("Best language?", days=-1)
        add_choice(q, "Python", votes=10)
        add_choice(q, "Go", votes=5)
        response = self.client.get(reverse("polls:results", args=(q.pk,)))
        self.assertContains(response, "Python: 10")
        self.assertContains(response, "Go: 5")


# ---------------------------------------------------------------------------
# View tests — Vote
# ---------------------------------------------------------------------------

class VoteViewTest(TestCase):
    """Tests for the polls vote view."""

    def setUp(self):
        self.question = create_question("Best editor?", days=-1)
        self.choice = add_choice(self.question, "VS Code", votes=0)

    def test_valid_vote_increments_count(self):
        """POSTing a valid choice increments its vote count."""
        self.client.post(
            reverse("polls:vote", args=(self.question.pk,)),
            {"choice": self.choice.pk},
        )
        self.choice.refresh_from_db()
        self.assertEqual(self.choice.votes, 1)

    def test_valid_vote_returns_200(self):
        """POSTing a valid choice returns HTTP 200."""
        response = self.client.post(
            reverse("polls:vote", args=(self.question.pk,)),
            {"choice": self.choice.pk},
        )
        self.assertEqual(response.status_code, 200)

    def test_missing_choice_returns_400(self):
        """POSTing without a choice returns HTTP 400."""
        response = self.client.post(
            reverse("polls:vote", args=(self.question.pk,)), {}
        )
        self.assertEqual(response.status_code, 400)

    def test_invalid_choice_returns_400(self):
        """POSTing an invalid choice ID returns HTTP 400."""
        response = self.client.post(
            reverse("polls:vote", args=(self.question.pk,)),
            {"choice": 9999},
        )
        self.assertEqual(response.status_code, 400)

    def test_vote_on_nonexistent_question_returns_404(self):
        """POSTing a vote on a non-existent question returns HTTP 404."""
        response = self.client.post(
            reverse("polls:vote", args=(9999,)),
            {"choice": self.choice.pk},
        )
        self.assertEqual(response.status_code, 404)
