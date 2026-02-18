<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

import { useForm } from "@tanstack/vue-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

const formSchema = z.object({
  start: z.iso.time(),
  end: z.iso.time(),
  date: z.iso.date(),
  title: z.string().min(1, "Title is required"),
  tags: z.string(),
});

const form = useForm({
  defaultValues: {
    start: "",
    end: "",
    date: "",
    title: "",
    tags: "",
  },
  validators: {
    onChange: formSchema,
  },
  onSubmit: (values) => {
    console.log("Form submitted with values:", values);
  },
});

function isInvalid(field: { state: { meta: { isTouched: any; isValid: any } } }) {
  return field.state.meta.isTouched && !field.state.meta.isValid;
}

const formValues = form.useStore((state) => state.values);

const duration = computed(() => {
  if (!formValues.value.start || !formValues.value.end) {
    return "00:00:00";
  }

  // return duration in HH:MM:SS format
  // const start = new Date(formValues.value.start);
  // const end = new Date(formValues.value.end);
  const start = new Date(`1970-01-01T${formValues.value.start}`);
  const end = new Date(`1970-01-01T${formValues.value.end}`);

  if (!start.getTime() || !end.getTime()) {
    return "00:00:00";
  }

  const diff = end.getTime() - start.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
});
</script>

<template>
  <form @submit.prevent="form.handleSubmit" class="grid grid-cols-2 gap-4 p-4">
    <Field class="col-span-full">
      <FieldLabel>Duration</FieldLabel>
      <h1 class="font-syne text-5xl font-extrabold text-center">{{ duration }}</h1>
    </Field>

    <FieldSeparator class="col-span-full" />

    <form.Field #default="{ field }" name="start">
      <Field :data-invalid="isInvalid(field)">
        <FieldLabel :for="field.name">Start</FieldLabel>
        <InputGroup>
          <InputGroupInput
            :id="field.name"
            :name="field.name"
            :model-value="field.state.value"
            :aria-invalid="isInvalid(field)"
            placeholder=""
            autocomplete="off"
            @blur="field.handleBlur"
            @input="field.handleChange($event.target.value)"
          />
        </InputGroup>
        <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
      </Field>
    </form.Field>
    <form.Field #default="{ field }" name="end">
      <Field :data-invalid="isInvalid(field)">
        <FieldLabel :for="field.name">End</FieldLabel>
        <InputGroup>
          <InputGroupInput
            :id="field.name"
            :name="field.name"
            :model-value="field.state.value"
            :aria-invalid="isInvalid(field)"
            placeholder=""
            autocomplete="off"
            @blur="field.handleBlur"
            @input="field.handleChange($event.target.value)"
          />
        </InputGroup>
        <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
      </Field>
    </form.Field>

    <form.Field #default="{ field }" name="date">
      <Field :data-invalid="isInvalid(field)" class="col-span-full">
        <FieldLabel :for="field.name">Date</FieldLabel>
        <InputGroup>
          <InputGroupInput
            :id="field.name"
            :name="field.name"
            :model-value="field.state.value"
            :aria-invalid="isInvalid(field)"
            placeholder=""
            autocomplete="off"
            @blur="field.handleBlur"
            @input="field.handleChange($event.target.value)"
          />
        </InputGroup>
        <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
      </Field>
    </form.Field>

    <FieldSeparator class="col-span-full" />

    <form.Field #default="{ field }" name="title">
      <Field :data-invalid="isInvalid(field)" class="col-span-full">
        <FieldLabel :for="field.name">Title</FieldLabel>
        <InputGroup>
          <InputGroupInput
            :id="field.name"
            :name="field.name"
            :model-value="field.state.value"
            :aria-invalid="isInvalid(field)"
            placeholder=""
            autocomplete="off"
            @blur="field.handleBlur"
            @input="field.handleChange($event.target.value)"
          />
        </InputGroup>
        <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
      </Field>
    </form.Field>

    <form.Field #default="{ field }" name="tags">
      <Field :data-invalid="isInvalid(field)" class="col-span-full">
        <FieldLabel :for="field.name">Tags</FieldLabel>
        <InputGroup>
          <InputGroupInput
            :id="field.name"
            :name="field.name"
            :model-value="field.state.value"
            :aria-invalid="isInvalid(field)"
            placeholder=""
            autocomplete="off"
            @blur="field.handleBlur"
            @input="field.handleChange($event.target.value)"
          />
        </InputGroup>
        <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
      </Field>
    </form.Field>
  </form>

  <form.Subscribe>
    <Button type="submit" size="lg" @click="form.handleSubmit" class="absolute bottom-4 right-4"
      >Save</Button
    >
  </form.Subscribe>
</template>
