<template>
    <div class="w-full max-w-3xl  border border-gray-200 rounded-lg">
      <!-- Barre d'outils de l'éditeur -->
      <div class="flex flex-wrap items-center space-x-4 p-1">
        <!-- Boutons de style avec tooltips -->
        <span data-tip="Gras" class="tooltip">

           <button type="button" @click="toggleStyle('bold')"  class="editor-button  hover:opacity-60 flex items-center justify-center" >
             <svg fill="#000000" width="19px" height="19px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
               <path d="M480.286 822.857h548.571c151.269 0 274.286-123.017 274.286-274.286 0-151.268-123.017-274.285-274.286-274.285H480.286v548.571Zm0 822.857H1166c151.269 0 274.286-123.017 274.286-274.285 0-151.269-123.017-274.286-274.286-274.286H480.286v548.571ZM1166 1920H206V0h822.857c302.537 0 548.572 246.034 548.572 548.571 0 134.263-48.549 257.418-128.778 352.732 159.223 96.137 265.92 270.994 265.92 470.126 0 302.537-246.034 548.571-548.571 548.571Z" fill-rule="evenodd"/>
              </svg>
            </button>
        </span>

        <span data-tip="Italique" class="tooltip flex items-center justify-center">
          <button type="button" @click="toggleStyle('italic')" class="editor-button  hover:opacity-60">
            <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 3H20M4 21H14M15 3L9 21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </span>

        <span data-tip="Souligné" class="tooltip flex items-center justify-center">

          <button type="button" @click="toggleUnderline"  class="editor-button hover:opacity-60" >
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 21H20M18 4V11C18 14.3137 15.3137 17 12 17C8.68629 17 6 14.3137 6 11V4M4 3H8M16 3H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </span>
        <!-- Sélecteur de couleur de texte -->
         
        <input type="color" v-model="currentColor" @change="applyTextColor" class="editor-input tooltip" data-tip="Couleur du texte">
        <!-- Bouton de lien -->
        <span data-tip="Lien" class="tooltip flex items-center justify-center">

          <button type="button" @click="toggleLink" class="editor-button hover:opacity-60">
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 12C14 14.7614 11.7614 17 9 17H7C4.23858 17 2 14.7614 2 12C2 9.23858 4.23858 7 7 7H7.5M10 12C10 9.23858 12.2386 7 15 7H17C19.7614 7 22 9.23858 22 12C22 14.7614 19.7614 17 17 17H16.5" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </span>

        <!-- Boutons pour alignement -->
        <span data-tip="Aligner à gauche" class="tooltip flex items-center justify-center">
          <button type="button" @click="alignText('Left')" class="editor-button hover:opacity-60">
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8H21M3 12H21M3 16H21M3 20H15M3 4H21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </span>

        <span data-tip="Centrer" class="tooltip flex items-center justify-center">
          <button type="button" @click="alignText('Center')" class="editor-button  hover:opacity-60">
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8H21M3 12H21M3 16H21M17 20H7M3 4H21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </span>

        <span data-tip="Aligner à droite" class="tooltip flex items-center justify-center">

          <button type="button" @click="alignText('Right')" class="editor-button  hover:opacity-60">
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8H21M3 12H21M3 16H21M11 20H21M3 4H21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </span>

        <span data-tip="Liste à puces" class="tooltip flex items-center justify-center">
          <button type="button" @click="toggleBulletList" class="editor-button hover:opacity-60">
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </span>


        <!-- Boutons pour indentation -->
        <span data-tip="Augmenter l'indentation" class="tooltip flex items-center justify-center">

        <button type="button" @click="indentText" class="editor-button hover:opacity-60">
          <svg fill="#000000" height="24px" width="24px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
              viewBox="0 0 512 512" xml:space="preserve">
            <g>
              <g>
                <path d="M490.667,0H21.333C9.552,0,0,9.551,0,21.333v469.333C0,502.449,9.552,512,21.333,512h469.333
                  c11.782,0,21.333-9.551,21.333-21.333V21.333C512,9.551,502.45,0,490.667,0z M469.334,469.333L469.334,469.333H42.667V42.667
                  h426.667V469.333z"/>
              </g>
            </g>
            <g>
              <g>
                <path d="M405.333,362.667h-128C265.552,362.667,256,372.218,256,384c0,11.782,9.551,21.333,21.333,21.333h128
                  c11.782,0,21.333-9.551,21.333-21.333C426.667,372.218,417.116,362.667,405.333,362.667z"/>
              </g>
            </g>
            <g>
              <g>
                <path d="M405.333,277.333H320c-11.782,0-21.333,9.551-21.333,21.333c0,11.782,9.551,21.333,21.333,21.333h85.333
                  c11.782,0,21.333-9.551,21.333-21.333C426.667,286.885,417.115,277.333,405.333,277.333z"/>
              </g>
            </g>
            <g>
              <g>
                <path d="M405.333,192.001h-128C265.552,192,256,201.551,256,213.333c0,11.782,9.551,21.334,21.333,21.334h128
                  c11.782,0,21.333-9.551,21.333-21.333C426.667,201.552,417.116,192.001,405.333,192.001z"/>
              </g>
            </g>
            <g>
              <g>
                <path d="M405.334,106.667H298.667c-11.782,0-21.333,9.551-21.333,21.333c-0.001,11.782,9.551,21.333,21.333,21.333h106.667
                  c11.782,0,21.333-9.551,21.333-21.333S417.117,106.667,405.334,106.667z"/>
              </g>
            </g>
            <g>
              <g>
                <path d="M213.333,106.667C201.552,106.667,192,116.218,192,128v256c0,11.782,9.551,21.333,21.333,21.333
                  s21.333-9.551,21.333-21.333V128C234.667,116.218,225.115,106.667,213.333,106.667z"/>
              </g>
            </g>
            <g>
              <g>
                <path d="M164.419,240.915l-42.667-42.667c-8.331-8.331-21.839-8.331-30.17,0s-8.331,21.839,0,30.17L119.164,256l-27.582,27.582
                  c-8.33,8.331-8.33,21.838,0.001,30.17c8.331,8.331,21.839,8.331,30.17,0l42.667-42.667
                  C172.75,262.754,172.75,249.246,164.419,240.915z"/>
              </g>
            </g>
          </svg>
        </button>
        </span>

        <span data-tip="Diminuer l'indentation" class="tooltip flex items-center justify-center">
        <button type="button" @click="outdentText" class="editor-button hover:opacity-60" >
          <svg fill="#000000" height="24px" width="24px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                viewBox="0 0 512 512" xml:space="preserve">
              <g>
                <g>
                  <path d="M490.667,0H21.333C9.552,0,0,9.551,0,21.333v469.333C0,502.449,9.552,512,21.333,512h469.333
                    c11.782,0,21.333-9.551,21.333-21.333V21.333C512,9.551,502.45,0,490.667,0z M469.334,469.333L469.334,469.333H42.667V42.667
                    h426.667V469.333z"/>
                </g>
              </g>
              <g>
                <g>
                  <path d="M234.667,106.667h-128c-11.782,0-21.333,9.551-21.333,21.333c-0.001,11.782,9.551,21.333,21.333,21.333h128
                    c11.782,0,21.333-9.551,21.333-21.333S246.45,106.667,234.667,106.667z"/>
                </g>
              </g>
              <g>
                <g>
                  <path d="M192,192.001h-85.333c-11.782,0-21.333,9.551-21.333,21.333c-0.001,11.781,9.551,21.333,21.333,21.333H192
                    c11.782,0,21.333-9.551,21.333-21.333C213.333,201.552,203.783,192.001,192,192.001z"/>
                </g>
              </g>
              <g>
                <g>
                  <path d="M234.667,277.334h-128c-11.782,0-21.333,9.551-21.333,21.333C85.333,310.449,94.885,320,106.667,320h128
                    c11.782,0,21.333-9.551,21.333-21.333C256,286.885,246.45,277.334,234.667,277.334z"/>
                </g>
              </g>
              <g>
                <g>
                  <path d="M213.334,362.667H106.667c-11.782,0-21.333,9.551-21.333,21.333c-0.001,11.782,9.551,21.333,21.333,21.333h106.667
                    c11.782,0,21.333-9.551,21.333-21.333C234.667,372.218,225.117,362.667,213.334,362.667z"/>
                </g>
              </g>
              <g>
                <g>
                  <path d="M298.667,106.667c-11.782,0-21.333,9.551-21.333,21.333v256c-0.001,11.782,9.551,21.333,21.333,21.333
                    C310.45,405.333,320,395.782,320,384V128C320,116.218,310.45,106.667,298.667,106.667z"/>
                </g>
              </g>
              <g>
                <g>
                  <path d="M392.838,256l27.582-27.582c8.331-8.331,8.331-21.839,0-30.17s-21.839-8.331-30.17,0l-42.667,42.667
                    c-8.331,8.331-8.331,21.839,0,30.17l42.666,42.667c8.331,8.331,21.839,8.331,30.17,0c8.331-8.331,8.331-21.839,0-30.17
                    L392.838,256z"/>
                </g>
              </g>
          </svg>
        </button>
        </span>
        <!-- Boutons pour annuler et rétablir -->
        <span data-tip="Annuler" class="tooltip flex items-center justify-center">
          <button type="button" @click="undo" class="editor-button hover:opacity-60" >
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="Edit / Undo">
                <path id="Vector" d="M10 8H5V3M5.29102 16.3569C6.22284 17.7918 7.59014 18.8902 9.19218 19.4907C10.7942 20.0913 12.547 20.1624 14.1925 19.6937C15.8379 19.225 17.2893 18.2413 18.3344 16.8867C19.3795 15.5321 19.963 13.878 19.9989 12.1675C20.0347 10.4569 19.5211 8.78001 18.5337 7.38281C17.5462 5.98561 16.1366 4.942 14.5122 4.40479C12.8878 3.86757 11.1341 3.86499 9.5083 4.39795C7.88252 4.93091 6.47059 5.97095 5.47949 7.36556" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
            </svg>
          </button>
        </span>

        <span data-tip="Rétablir" class="tooltip flex items-center justify-center">

          <button type="button" @click="redo" class="editor-button hover:opacity-60">
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="Edit / Undo" transform="scale(-1, 1) translate(-24, 0)">
                <path id="Vector" d="M10 8H5V3M5.29102 16.3569C6.22284 17.7918 7.59014 18.8902 9.19218 19.4907C10.7942 20.0913 12.547 20.1624 14.1925 19.6937C15.8379 19.225 17.2893 18.2413 18.3344 16.8867C19.3795 15.5321 19.963 13.878 19.9989 12.1675C20.0347 10.4569 19.5211 8.78001 18.5337 7.38281C17.5462 5.98561 16.1366 4.942 14.5122 4.40479C12.8878 3.86757 11.1341 3.86499 9.5083 4.39795C7.88252 4.93091 6.47059 5.97095 5.47949 7.36556" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
            </svg>
            
          </button>
        </span>
      </div>
  
      <!-- Zone de texte éditable -->
      <div contenteditable="true" class="border border-gray-200 text-base focus:outline-none h-96" ref="editor" @input="updateContent" v-html="text"></div>
  
      <!-- Aperçu du contenu édité -->
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits } from 'vue';
  
  const emits = defineEmits(['update:modelValue']); // Définir les événements émis
  
  const currentColor = ref('#000000');
  const isUnderlineActive = ref(false);
  
  const toggleStyle = (style) => {
    document.execCommand(style);
  };
  
  const isStyleActive = (style) => {
    return document.queryCommandState(style);
  };
  
  const toggleUnderline = () => {
    document.execCommand('underline');
    isUnderlineActive.value = !isUnderlineActive.value;
  };
  
  const toggleLink = () => {
    const url = prompt("Entrez l'URL :");
    if (url) {
      document.execCommand('createLink', false, url);
    }
  };
  
  const applyTextColor = () => {
    document.execCommand('foreColor', false, currentColor.value);
  };
  
  const alignText = (alignment) => {
    document.execCommand('justify' + alignment);
  };
  
  const toggleBulletList = () => {
    document.execCommand('insertUnorderedList');
  };
  
  const indentText = () => {
    document.execCommand('indent');
  };
  
  const outdentText = () => {
    document.execCommand('outdent');
  };
  
  const undo = () => {
    document.execCommand('undo');
  };
  
  const redo = () => {
    document.execCommand('redo');
  };
  
  const updateContent = (event) => {
    const editorContent = event.target.innerHTML;
    emits('update:modelValue', editorContent); // Utiliser emits pour émettre l'événement
  };
  
  // Initialiser le contenu éditable avec un exemple de texte
  const props = defineProps({
    text: String,
  });
  
  // Utiliser le texte passé en paramètre comme contenu initial
  const description = ref(props.text);
  </script>