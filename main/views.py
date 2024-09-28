from django.http import HttpResponse
from django.shortcuts import render


def index(request):
    context = {
        "title": "Home",
        "content": "Furniture store home page",
    }
    return render(request, "main/index.html", context)


def about(request):
    context = {
        "title": "Home - About Us",
        "content": "About Us",
        "text_on_page": "Text about why this store is so great, and how good the products are.",
    }
    return render(request, "main/about.html", context)
