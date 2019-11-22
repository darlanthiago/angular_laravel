import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpEvent } from '@angular/common/http';
import { Post } from "./post";

@Injectable({
  providedIn: 'root'
})
export class PostService {


  public posts: Post[] = [
  ];

  public baseUrl: string = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) {

    this.http.get(this.baseUrl, { responseType: 'json' }).subscribe(
      (posts: any[]) => {
        for (let p of posts) {
          this.posts.push(
            new Post(
              p.nome,
              p.titulo,
              p.subtitulo,
              p.email,
              p.mensagem,
              p.arquivo,
              p.id,
              p.likes
            )
          );
        }
      }
    );

  }


  salvar(post: Post, file: File) {

    const uploadData = new FormData();

    uploadData.append('nome', post.nome);
    uploadData.append('email', post.email);
    uploadData.append('titulo', post.titulo);
    uploadData.append('subtitulo', post.subtitulo);
    uploadData.append('mensagem', post.mensagem);
    uploadData.append('arquivo', file, file.name);

    this.http.post(this.baseUrl, uploadData,
      {
        observe: 'events',
        // reportProgress : true,

      }).subscribe((e: any) => {

        if (e.type == HttpEventType.Response) {
          // console.log(e);
          let p: any = e.body;
          this.posts.push(
            new Post(
              p.nome,
              p.titulo,
              p.subtitulo,
              p.email,
              p.mensagem,
              p.arquivo,
              p.id,
              p.likes
            )
          );
        }
      });

  }

  like(id: number) {
    this.http.get(this.baseUrl + 'like/' + id, { responseType: 'json' })
      .subscribe((e: any) => {

        let p = this.posts.find((p) => p.id == id);

        p.likes = e.likes;
      }

      );
  }

  apagar(id: number) {

    this.http.delete(this.baseUrl + id)
      .subscribe((e) => {

        let i = this.posts.findIndex((p) => p.id == id);
        if (i >= 0) {
          this.posts.splice(i, 1);
        }
      });

  }




}
