from django.conf import settings
from django.db import models
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill
# Create your models here.


def photo_path(instance, filename):
    from time import strftime
    from random import choice
    import string
    arr = [choice(string.ascii_letters) for _ in range(8)]
    pid = ''.join(arr)
    extension = filename.split('.')[-1]
    return '{}/{}/{}.{}'.format(strftime('post/%Y/%m/%d/'),
                                instance.author.username, pid, extension)


class Post(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, 
                               on_delete=models.CASCADE)
    photo = ProcessedImageField(upload_to=photo_path,
                                processors=[ResizeToFill(600, 600)],
                                format='JPEG',
                                options={'quality': 90})
    content = models.CharField(max_length=140, help_text="최대 140자 입력 가능")

    like_user_set = models.ManyToManyField(settings.AUTH_USER_MODEL, 
                                            blank=True,
                                            related_name='like_user_set',
                                            through='Like')
    bookmark_user_set = models.ManyToManyField(settings.AUTH_USER_MODEL,
                                                blank=True,
                                                related_name='bookmark_user_set',
                                                through='Bookmark')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
    
    @property
    def like_count(self):
        return self.like_user_set.count()
    
    @property
    def bookmark_count(self):
        return self.bookmark_user_set.count()

    def __str__(self):
        return self.content

class Like(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DataTimeField(auto_now_add=True)
    upload_at = models.DataTimeField(auto_now=True)

    class Meta:
        unique_together = {
            ('user', 'post')
        }

class Bookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DataTimeField(auto_now_add=True)
    upload_at = models.DataTimeField(auto_now=True)

    class Meta:
        unique_together = {
            ('user', 'post')
        }

class Comment(models.Model):
    user = models.ForeignKey(Post, on_delete=models.CASCADE)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.CharField(max_length=40)
    created_at = models.DataTimeField(auto_now_add=True)
    upload_at = models.DataTimeField(auto_now=True)

    class Meta:
        ordering = ['-id']
    
    def __str__(self):
        return self.content
    
class Profile(models.Model):
    follow_set = models.ManyToManyField('self',
                                        blank=True,
                                        through='Follow',
                                        symmetrical=False,)
    @property
    def get_follower(self):
        return [i.from_user for i in self.follower_user.all()]
    
    @property
    def get_following(self):
        return [i.to_user for i in self.follow_user.all()]
    
    @property
    def follower_count(self):
        return len(self.get_follower)
    
    @property
    def following_count(self):
        return len(self.get_following)
    
    
    def is_follower(self, user):
        return user in self.get_follower
    
    def is_following(self, user):
        return user in self.get_following