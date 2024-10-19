from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    image = models.ImageField(
        upload_to="users_images/", null=True, blank=True, verbose_name="Avatar"
    )
    phone_number = models.CharField(max_length=15, verbose_name="Phone number", default="")

    class Meta:
        db_table = "user"
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return self.username
