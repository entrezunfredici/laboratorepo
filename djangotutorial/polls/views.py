from django.http import HttpResponse
from django.utils import timezone

from .models import Choice, Question


def index(request):
    """Return the 5 most recent published questions as plain text."""
    latest_questions = Question.objects.filter(
        pub_date__lte=timezone.now()
    ).order_by("-pub_date")[:5]
    if not latest_questions:
        return HttpResponse("No polls available.")
    output = ", ".join([q.question_text for q in latest_questions])
    return HttpResponse(f"Latest questions: {output}")


def detail(request, question_id):
    """Return the question text and its choices."""
    try:
        question = Question.objects.get(pk=question_id)
    except Question.DoesNotExist:
        return HttpResponse(
            f"Question {question_id} does not exist.", status=404
        )
    choices = question.choice_set.all()
    choices_text = ", ".join([c.choice_text for c in choices])
    return HttpResponse(
        f"Question: {question.question_text} | Choices: {choices_text}"
    )


def results(request, question_id):
    """Return the vote results for a question."""
    try:
        question = Question.objects.get(pk=question_id)
    except Question.DoesNotExist:
        return HttpResponse(
            f"Question {question_id} does not exist.", status=404
        )
    choices = question.choice_set.all()
    output = ", ".join([f"{c.choice_text}: {c.votes}" for c in choices])
    return HttpResponse(
        f"Results for '{question.question_text}': {output}"
    )


def vote(request, question_id):
    """Handle a vote submission for a question."""
    try:
        question = Question.objects.get(pk=question_id)
    except Question.DoesNotExist:
        return HttpResponse(
            f"Question {question_id} does not exist.", status=404
        )
    choice_id = request.POST.get("choice")
    if not choice_id:
        return HttpResponse("No choice selected.", status=400)
    try:
        selected_choice = question.choice_set.get(pk=choice_id)
    except Choice.DoesNotExist:
        return HttpResponse("Invalid choice.", status=400)
    selected_choice.votes += 1
    selected_choice.save()
    return HttpResponse(
        f"Vote recorded for '{selected_choice.choice_text}'.", status=200
    )
