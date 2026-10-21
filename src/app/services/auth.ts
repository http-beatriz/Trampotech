import { Injectable } from '@angular/core';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  termosAceitos: boolean;
  dataCriacao: string;
  trilhaEscolhida?: 'execucao' | 'fundamentos';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'trilha_usuarios';
  private readonly LOGGED_USER_KEY = 'trilha_usuario_logado';

  registrar(dados: Omit<Usuario, 'id' | 'dataCriacao'>): Usuario {
    const usuarios = this.listarUsuarios();
    const novoUsuario: Usuario = {
      ...dados,
      id: Date.now().toString(),
      dataCriacao: new Date().toISOString(),
      trilhaEscolhida: 'execucao'
    };

    usuarios.push(novoUsuario);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(usuarios));
    localStorage.setItem(this.LOGGED_USER_KEY, JSON.stringify(novoUsuario));
    return novoUsuario;
  }

  listarUsuarios(): Usuario[] {
    const data = localStorage.getItem(this.USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  getUsuarioLogado(): Usuario | null {
    const data = localStorage.getItem(this.LOGGED_USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  atualizarUsuario(usuarioAtualizado: Usuario): void {
    const usuarios = this.listarUsuarios().map(u =>
      u.id === usuarioAtualizado.id ? usuarioAtualizado : u
    );
    localStorage.setItem(this.USERS_KEY, JSON.stringify(usuarios));
    localStorage.setItem(this.LOGGED_USER_KEY, JSON.stringify(usuarioAtualizado));
  }

  removerUsuario(id: string): void {
    const usuarios = this.listarUsuarios().filter(u => u.id !== id);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(usuarios));
  }

  login(email: string, senha?: string): boolean {
    const usuarios = this.listarUsuarios();
    const user = usuarios.find(u => u.email === email && u.senha === senha);
    if (user) {
      localStorage.setItem(this.LOGGED_USER_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.LOGGED_USER_KEY);
  }
}