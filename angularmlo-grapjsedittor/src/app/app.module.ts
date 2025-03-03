// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { GrapesJSComponent } from './grapes-editor/grapes-editor.component';

@NgModule({
  declarations: [AppComponent, GrapesJSComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
