<template>
  <div class="w-full border border-gray-200 rounded-lg">
    <!-- Barre d'outils de l'éditeur -->
    <div class="flex flex-wrap items-center space-x-4 p-1">
      <!-- Boutons de style avec tooltips -->
      <span data-tip="Gras" class="tooltip">
        <button
          type="button"
          @click="toggleStyle('bold')"
          class="editor-button hover:opacity-60 flex items-center justify-center"
        >
          <svg fill="#000000" width="19px" height="19px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
            <path d="M480.286 822.857h548.571c151.269 0 274.286-123.017 274.286-274.286 0-151.268-123.017-274.285-274.286-274.285H480.286v548.571Zm0 822.857H1166c151.269 0 274.286-123.017 274.286-274.285 0-151.269-123.017-274.286-274.286-274.286H480.286v548.571ZM1166 1920H206V0h822.857c302.537 0 548.572 246.034 548.572 548.571 0 134.263-48.549 257.418-128.778 352.732 159.223 96.137 265.92 270.994 265.92 470.126 0 302.537-246.034 548.571-548.571 548.571Z" fill-rule="evenodd"/>
          </svg>
        </button>
      </span>

      <span data-tip="Italique" class="tooltip flex items-center justify-center">
        <button
          type="button"
          @click="toggleStyle('italic')"
          class="editor-button hover:opacity-60"
        >
          <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3H20M4 21H14M15 3L9 21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </span>

      <span data-tip="Souligné" class="tooltip flex items-center justify-center">
        <button type="button" @click="toggleStyle('underline')" class="editor-button hover:opacity-60">
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 21H20M18 4V11C18 14.3137 15.3137 17 12 17C8.68629 17 6 14.3137 6 11V4M4 3H8M16 3H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </span>

      <!-- Sélecteur de couleur de texte -->
      <input
        type="color"
        v-model="currentColor"
        @change="applyTextColor"
        class="editor-input tooltip"
        data-tip="Couleur du texte"
      />

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
        <button type="button" @click="alignText('Center')" class="editor-button hover:opacity-60">
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8H21M3 12H21M3 16H21M17 20H7M3 4H21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </span>

      <span data-tip="Aligner à droite" class="tooltip flex items-center justify-center">
        <button type="button" @click="alignText('Right')" class="editor-button hover:opacity-60">
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
          <svg fill="#000000" height="24px" width="24px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path d="M490.667,0H21.333C9.552,0,0,9.551,0,21.333v469.333C0,502.449,9.552,512,21.333,512h469.333
              c11.782,0,21.333-9.551,21.333-21.333V21.333C512,9.551,502.45,0,490.667,0z M469.334,469.333L469.334,469.333H42.667V42.667
              h426.667V469.333z"/>
            </g>
            <g>
              <path d="M405.333,362.667h-128C265.552,362.667,256,372.218,256,384c0,11.782,9.551,21.333,21.333,21.333h106.667v64
              c0,6.614,5.369,10.667,10.667,10.667s10.667-4.053,10.667-10.667v-64h21.333c11.782,0,21.333-9.551,21.333-21.333
              C426.667,372.218,417.115,362.667,405.333,362.667z"/>
            </g>
            <g>
              <path d="M362.667,170.667H213.333c-11.782,0-21.333,9.551-21.333,21.333s9.551,21.333,21.333,21.333h149.333
              c11.782,0,21.333-9.551,21.333-21.333S374.449,170.667,362.667,170.667z"/>
            </g>
          </svg>
        </button>
      </span>

      <span data-tip="Diminuer l'indentation" class="tooltip flex items-center justify-center">
        <button type="button" @click="outdentText" class="editor-button hover:opacity-60">
          <svg fill="#000000" height="24px" width="24px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path d="M490.667,0H21.333C9.552,0,0,9.551,0,21.333v469.333C0,502.449,9.552,512,21.333,512h469.333
              c11.782,0,21.333-9.551,21.333-21.333V21.333C512,9.551,502.45,0,490.667,0z M469.334,469.333L469.334,469.333H42.667V42.667
              h426.667V469.333z"/>
            </g>
            <g>
              <path d="M362.667,277.333H213.333c-11.782,0-21.333,9.551-21.333,21.333s9.551,21.333,21.333,21.333h149.333
              c11.782,0,21.333-9.551,21.333-21.333S374.449,277.333,362.667,277.333z"/>
            </g>
            <g>
              <path d="M362.667,170.667H213.333c-11.782,0-21.333,9.551-21.333,21.333s9.551,21.333,21.333,21.333h149.333
              c11.782,0,21.333-9.551,21.333-21.333S374.449,170.667,362.667,170.667z"/>
            </g>
          </svg>
        </button>
      </span>
    </div>

    <!-- Zone de texte éditable -->
    <div
      ref="editor"
      contenteditable="true"
      @input="updateContent"
      class="editor-content p-4 focus:outline-none"
    ></div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  text: String,
});

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
const description = ref(props.text);
</script>

<style scoped>
.tooltip {
  position: relative;
  cursor: pointer;
}

.tooltip::after {
  content: attr(data-tip);
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #000000;
  color: #ffffff;
  padding: 5px;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 1;
}

.editor-button {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
}

.editor-content {
  min-height: 200px;
  border-top: 1px solid #e2e8f0;
  outline: none;
}

.editor-input {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  vertical-align: middle;
  cursor: pointer;
}
</style>
