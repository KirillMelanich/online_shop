from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib.messages import success
from django.contrib.messages.context_processors import messages
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse

from users.forms import UserLoginForm, UserRegistrationForm, ProfileForm


def login(request):
    if request.method == "POST":
        form = UserLoginForm(data=request.POST)
        if form.is_valid():
            username = request.POST["username"]
            password = request.POST["password"]
            user = auth.authenticate(username=username, password=password)
            if user:
                auth.login(request, user)
                messages(success(request, f"{username}, you are logged in"))
                if request.POST.get("next"):
                    return HttpResponseRedirect(request.POST.get("next"))
                return HttpResponseRedirect(reverse("main:index"))
    else:
        form = UserLoginForm()

    context = {"title": "Home - Authorization", "form": form}
    return render(request, "users/login.html", context=context)


def registration(request):

    if request.method == "POST":
        form = UserRegistrationForm(data=request.POST)
        if form.is_valid():
            form.save()
            user = form.instance
            auth.login(request, user)
            messages((request, f"{user.username}, you are successfully logged in"))
            return HttpResponseRedirect(reverse("main:index"))
    else:
        form = UserRegistrationForm()

    context = {"title": "Registration", "form": form}
    return render(request, "users/registration.html", context=context)


@login_required
def profile(request):

    if request.method == "POST":
        form = ProfileForm(
            data=request.POST, instance=request.user, files=request.FILES
        )
        if form.is_valid():
            form.save()
            messages(success(request, f"Profile successfully updated"))
            return HttpResponseRedirect(reverse("user:profile"))
    else:
        form = ProfileForm(instance=request.user)

    context = {
        "title": "Profile",
        "form": form,
    }
    return render(request, "users/profile.html", context=context)


@login_required
def logout(request):
    auth.logout(request)
    messages(success(request, f"{request.user.username}, you are logged out"))
    return redirect(reverse("main:index"))
