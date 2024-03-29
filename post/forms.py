from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    photo = forms.ImageField(label='')
    content = forms.CharField(label='', widget=forms.Textarea(attrs={
        'class': 'post-new-content',
        'rows': 5,
        'cols': 50,
        'placeholder': '140자 까지 등록 가능합니다'
    }))

    class Meta:
        model = Post
        fields = ['photo', 'content']

class CommentForm(form.ModelForm):
    content = forms.CharField(label='', width=forms.TextInput(attrs={
        'class': 'comment-form',
        'size': '70px',
        'placeholder': '댓글 달기...',
        'maxlength': '40',
    }))

    class Meta:
        model = Comment
        fields = ['content']