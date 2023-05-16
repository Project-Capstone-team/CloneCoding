from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404, redirect, render
from .models import Post, Comment
from .forms import PostForm
from .forms import CommentForm

import json
from django.views.dacorators.http import require_POST
from django.http import HttpResponse

# Create your views here.

def post_list(request):
    posts = Post.objects.all()
    
    comment_form = CommentForm()

    if request.user.is_authenticated:
        username = request.user
        user = get_object_or_404(get_user_model(), username=username)
        user_profile = user.profile
        return render(request, 'post/post_list.html', {
            'user_profile': user_profile,
            'posts': posts,
            'comment_form': comment_form,
        })
    else:
        return render(request, 'post/post_list.html', {   
            'posts': posts,
            'comment_form': comment_form,
        })

@login_required
def post_new(request):
    if request.method == 'POST':
        form = PostForm(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False) # 중복 방지
            post.autho = request.user
            post.save()
            # post.tag_save()
            messages.info(request, '새 글이 등록되었습니다.')
            return redirect('post:post_list')
        else:
            form = PostForm()
        return render(request, 'post/post_new.html', {
            'form': form,
        })

@login_required
def post_edit(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if post.author != request.user:
        messages.warning(request, '잘못된 접근입니다.')
        return redirect('post:post_list')
    
    if request.method == 'POST':
        form = PostForm(request.POST, request.FILES, instance=post)
        if form.is_valid():
            post = form.save()
            # post.tag_set.clear()
            # post.tag_save()
            messages.success(request, '수정완료')
            return redirect('post:post_list')
        else:
            form = PostForm(instance=post)
        
        return render(request, 'post/post_edit.html', {
            'post': post,
            'form': form,
        })

@login_required
def post_delete(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if post.autho != request.user or request.method != 'POST': # URL를 통한 DB접근을 막는다
        messages.warning(request, '잘못된 접근입니다.')
    else:
        post.delete()
        # massages.success(requset, '삭제완료')
    return redirect('post:post_list')

@login_required
@require_POST
def post_like(request):
    pk = request.POST.get('pk', None)
    post = get_object_or_404(Post, pk=pk)
    post_like, post_like_created = post.like_set.get_or_create(user=request.user)

    if not post_like_created:
        post_like.delete()
        messages = "좋아요 취소"
    else:
        messages = "좋아요"

    context = {'like_count': post.like_count,
                'message': message}
    return HttpResponse(json.dumps(context), content_typ="application/json")

    if not post_bookmark_created:
        post_bookmark_delete()
        message = "북마크 취소"
    else:
        message = "북마크"
    
    context = {'bookmark_count': post.bookmark_count,
                'message': message}
    return HttpResponse(json.dumps(context), content_type="application/json")