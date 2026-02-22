import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { supabase } from './supabase.client';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <main style="max-width:720px;margin:40px auto;padding:0 16px;font-family:system-ui;">
    <h1 style="font-size:32px;margin:0 0 8px;">Nuestra Boda ❤️</h1>
    <p style="margin:0 0 24px;color:#444;">Confirma tu asistencia</p>

    <form (ngSubmit)="submit()" #f="ngForm" style="display:grid;gap:12px;">
      <label>
        Nombre y apellidos *
        <input name="nombre" [(ngModel)]="nombre" required
          style="width:100%;padding:10px;border:1px solid #ccc;border-radius:10px;margin-top:6px;">
      </label>

      <label>
        ¿Asistes? *
        <select name="asiste" [(ngModel)]="asiste" required
          style="width:100%;padding:10px;border:1px solid #ccc;border-radius:10px;margin-top:6px;">
          <option [ngValue]="true">Sí</option>
          <option [ngValue]="false">No</option>
        </select>
      </label>

      <label>
        Nº acompañantes
        <input type="number" min="0" name="acompanantes" [(ngModel)]="acompanantes"
          style="width:100%;padding:10px;border:1px solid #ccc;border-radius:10px;margin-top:6px;">
      </label>

      <label>
        Alergias / intolerancias
        <textarea name="alergias" [(ngModel)]="alergias" rows="3"
          style="width:100%;padding:10px;border:1px solid #ccc;border-radius:10px;margin-top:6px;"></textarea>
      </label>

      <button type="submit" [disabled]="loading || !f.valid"
        style="padding:12px 14px;border-radius:12px;border:0;cursor:pointer;font-weight:600;">
        {{ loading ? 'Enviando…' : 'Enviar' }}
      </button>

      <p *ngIf="ok" style="color:green;margin:0;">¡Enviado! Gracias ❤️</p>
      <p *ngIf="error" style="color:#b00020;margin:0;">{{ error }}</p>
    </form>
  </main>
  `
})
export class AppComponent {

  nombre = '';
  asiste = true;
  acompanantes = 0;
  alergias = '';

  loading = false;
  ok = false;
  error: string | null = null;

  async submit() {
    this.loading = true;
    this.ok = false;
    this.error = null;

    const { error } = await supabase.from('rsvps').insert([{
      nombre: this.nombre.trim(),
      asiste: this.asiste,
      acompanantes: Number(this.acompanantes || 0),
      alergias: this.alergias?.trim() || null,
    }]);

    this.loading = false;

    if (error) {
      this.error = error.message;
      return;
    }

    this.ok = true;
  }
}