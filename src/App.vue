<script setup>
import { ref, computed } from "vue";
import { Editor } from "./editor/instance.js";

const editorInstance = new Editor();

editorInstance.parse("### Hello World");

const activeTab = ref("write");
const textInput = ref("<h1>Hello World</h1>");

const form = ref({
  rawText: "",
  previewText: "",
});

const previewTab = () => {
  activeTab.value = "preview";
  // form.value.previewText = editorInstance.parse(form.value.rawText);
};
const onChange = (value, name) => {
  form.value[name] = value;
};
</script>

<template>
  <div class="container-fluid">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === 'write' }"
          @click="activeTab = 'write'"
          >Write</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === 'preview' }"
          @click="previewTab"
          >Preview</a
        >
      </li>
    </ul>

    <div class="tab-content border p-3">
      <div v-if="activeTab === 'write'">
        <!-- Write Tab Content -->
        <textarea
          name="rawText"
          class="form-control bg-secondary text-white"
          v-model="textInput"
          @input="onChange(textInput, 'rawText')"
          rows="6"
          placeholder="Write something..."
        />
      </div>

      <div v-else>
        <!-- Preview Tab Content -->
        <div class="p-3 bg-light border">
          <p v-html="form.previewText"></p>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
body {
  background-color: rgba(0, 0, 0, 0.7) !important;
}
</style>
