from django.http import HttpResponse
from django.shortcuts import render


def index(request):
    context = {
        "title": "Home",
        "content": "Main page of the shop - HOME",
        "list": [1, 2, 3, 4, 5],
        "dict": {"a": 1, "b": 2, "c": 3},
    }
    return render(request, "main/index.html", context=context)


def about(request):
    return HttpResponse("Home page")
