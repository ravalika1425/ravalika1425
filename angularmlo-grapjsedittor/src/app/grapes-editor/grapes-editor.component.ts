// grapesjs.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import grapesjs from 'grapesjs';
import basicBlockPlugin from 'grapesjs-blocks-basic';
import gjsNav from 'grapesjs-navbar';
import exportPlugin from 'grapesjs-plugin-export';
import gjsForms from 'grapesjs-plugin-forms';
import 'grapesjs/dist/css/grapes.min.css';

@Component({
  selector: 'app-grapesjs',
  templateUrl: './grapes-editor.component.html',
  styleUrls: ['./grapes-editor.component.css'],
})
export class GrapesJSComponent implements OnInit, OnDestroy {
  @ViewChild('editor', { static: true }) editorRef!: ElementRef;
  private editor: any;

  // ngOnInit(): void {
  //   this.initEditor();
  // }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.destroy();
    }
  }
  // grapesjs.component.ts
  ngOnInit(): void {
    console.log('Initializing GrapesJS editor...');
    this.initEditor();
  }

  private initEditor(): void {
    console.log('GrapesJS editor container:', this.editorRef.nativeElement);
    this.editor = grapesjs.init({
      container: this.editorRef.nativeElement,
      fromElement: true,
      height: '80vh',
      width: 'auto',
      jsInHtml: true,
      canvas: {
        scripts: [
          'https://unpkg.com/tailwindcss-cdn@3.4.3/tailwindcss-with-all-plugins.js',
          'https://cdn.jsdelivr.net/npm/apexcharts',
        ],
      },
      storageManager: false,
      plugins: [exportPlugin, basicBlockPlugin, gjsForms, gjsNav],
    });

    this.editor.BlockManager.add('my-block-id', {
      label: 'My Block',
      content: '<div class="my-block">This is my block content</div>',
      category: 'Custom',
    });

    this.editor.Commands.add('add-blocks', {
      run: (editor: any) => {
        editor.BlockManager.add('my-block-id', {
          label: 'My Block',
          content: '<div class="my-block">This is my block content</div>',
          category: 'Custom',
        });
      },
    });

    this.editor.runCommand('add-blocks');
    console.log('GrapesJS editor initialized:', this.editor);
  }

  handleSave(): void {
    const htmlContent = this.editor.getHtml();
    console.log('Saved HTML Content:', htmlContent);
  }
}
