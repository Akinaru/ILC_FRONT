<template>
  <div class="w-full border  rounded-lg shadow-sm input-bordered">


    <!-- Barre d'outils de l'éditeur -->
    <div class="flex flex-wrap items-center space-x-4 py-2 px-1">
      <!-- Boutons de style avec tooltips -->
      <span data-tip="Gras" class="tooltip">
        <button
          type="button"
          @click="toggleStyle('bold')"
          class="editor-button hover:opacity-60 flex items-center justify-center"
        >
          <svg fill="currentColor" width="19px" height="19px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
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
            <path d="M10 3H20M4 21H14M15 3L9 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </span>

      <span data-tip="Souligné" class="tooltip flex items-center justify-center">
        <button type="button" @click="toggleStyle('underline')" class="editor-button hover:opacity-60">
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 21H20M18 4V11C18 14.3137 15.3137 17 12 17C8.68629 17 6 14.3137 6 11V4M4 3H8M16 3H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
            <path d="M14 12C14 14.7614 11.7614 17 9 17H7C4.23858 17 2 14.7614 2 12C2 9.23858 4.23858 7 7 7H7.5M10 12C10 9.23858 12.2386 7 15 7H17C19.7614 7 22 9.23858 22 12C22 14.7614 19.7614 17 17 17H16.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </span>

      <!-- Boutons pour alignement -->
      <span data-tip="Aligner à gauche" class="tooltip flex items-center justify-center">
        <button type="button" @click="alignText('Left')" class="editor-button hover:opacity-60">
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8H21M3 12H21M3 16H21M3 20H15M3 4H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </span>

      <span data-tip="Centrer" class="tooltip flex items-center justify-center">
        <button type="button" @click="alignText('Center')" class="editor-button hover:opacity-60">
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8H21M3 12H21M3 16H21M17 20H7M3 4H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </span>

      <span data-tip="Aligner à droite" class="tooltip flex items-center justify-center">
        <button type="button" @click="alignText('Right')" class="editor-button hover:opacity-60">
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8H21M3 12H21M3 16H21M11 20H21M3 4H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </span>

      <span data-tip="Liste à puces" class="tooltip flex items-center justify-center">
        <button type="button" @click="toggleBulletList" class="editor-button hover:opacity-60">
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </span>

      <!-- Boutons pour indentation -->
      <span data-tip="Augmenter l'indentation" class="tooltip flex items-center justify-center">
        <button type="button" @click="indentText" class="editor-button hover:opacity-60">
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5H21M10 10H21M10 14H21M3 19H21M3 9L6 12L3 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </span>

      <span data-tip="Diminuer l'indentation" class="tooltip flex items-center justify-center">
        <button type="button" @click="outdentText" class="editor-button hover:opacity-60">
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5H21M14 10H3M14 14H3M3 19H21M21 9L18 12L21 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

        </button>
      </span>
    </div>

    <!-- Zone de texte éditable -->
    <div
      ref="editor"
      contenteditable="true"
      @input="updateContent"
      class="editor-content p-2 focus:outline-none inputt  rounded-b-lg"
      id="editorzone"
    ></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  text: String,
});

const emits = defineEmits(['update:modelValue']); // Définir les événements émis

const currentColor = ref('#000000');

const toggleStyle = (style) => {
  document.execCommand(style);
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


const updateContent = (event) => {
  const editorContent = event.target.innerHTML;
  emits('update:modelValue', editorContent); // Utiliser emits pour émettre l'événement
};

</script>

<style scoped>


.editor-button {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
}

.inputt input:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
}
.inputt:focus,
  .inputt:focus-within {
    box-shadow: none;
    border-color: var(--fallback-bc,oklch(var(--bc)/0.2));
    outline-style: solid;
    outline-width: 2px;
    outline-offset: 2px;
    outline-color: var(--fallback-bc,oklch(var(--bc)/0.2));
}
.inputt:focus,
  .inputt:focus-within {
    box-shadow: none;
    border-color: var(--fallback-bc,oklch(var(--bc)/0.2));
    outline-style: solid;
    outline-width: 2px;
    outline-offset: 2px;
    outline-color: var(--fallback-bc,oklch(var(--bc)/0.2));
}

.editor-content {
  min-height: 200px;
  border-top: 1px solid var(--fallback-bc, oklch(var(--bc) / 0.2));
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
