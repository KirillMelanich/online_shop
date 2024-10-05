from django.contrib import auth
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from users.forms import UserLoginForm


def login(request):
    if request.method == "POST":
        form = UserLoginForm(data=request.POST)
        if form.is_valid():
            username = request.POST["username"]
            password = request.POST["password"]
            user = auth.authenticate(username=username, password=password)
            if user:
                auth.login(request, user)
                return HttpResponseRedirect(reverse("main:index"))
    else:
        form = UserLoginForm()

    context = {"title": "Home - Authorization", "form": form}
    return render(request, "users/login.html", context=context)


def registration(request):
    context = {"title": "Registration"}
    return render(request, "users/registration.html", context=context)


def profile(request):
    context = {"title": "Profile"}
    return render(request, "users/profile.html", context=context)


def logout(request):
    context = {"title": "Logout"}
    return render(request, "goods/catalog.html", context=context)