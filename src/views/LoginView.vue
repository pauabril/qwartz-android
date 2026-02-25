<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { useForm } from '@tanstack/vue-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
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
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'

const router = useRouter()

const formSchema = z.object({
  baseUrl: z.string(),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

const form = useForm({
  defaultValues: {
    baseUrl: 'localhost',
    username: '',
    password: '',
  },
  validators: {
    onChange: formSchema,
  },
  onSubmit: ({ value }) => {
    router.push({ name: 'list' })
  },
})

function isInvalid(field: { state: { meta: { isTouched: any; isValid: any } } }) {
  return field.state.meta.isTouched && !field.state.meta.isValid
}
</script>

<template>
  <main class="h-full w-full flex flex-col items-stretch justify-center gap-4 p-8">
    <h1 class="w-full font-syne text-6xl font-black text-center">qwartz</h1>

    <form @submit.prevent="form.handleSubmit" class="contents">
      <form.Field #default="{ field }" name="baseUrl">
        <Field :data-invalid="isInvalid(field)" class="col-span-full">
          <FieldLabel :for="field.name">Base URL</FieldLabel>
          <InputGroup>
            <InputGroupInput
              :id="field.name"
              :name="field.name"
              :model-value="field.state.value"
              :aria-invalid="isInvalid(field)"
              placeholder=""
              @blur="field.handleBlur"
              @input="field.handleChange($event.target.value)"
            />
          </InputGroup>
          <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
        </Field>
      </form.Field>

      <form.Field #default="{ field }" name="username">
        <Field :data-invalid="isInvalid(field)" class="col-span-full">
          <FieldLabel :for="field.name">Username</FieldLabel>
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

      <form.Field #default="{ field }" name="password">
        <Field :data-invalid="isInvalid(field)" class="col-span-full">
          <FieldLabel :for="field.name">Password</FieldLabel>
          <InputGroup>
            <InputGroupInput
              :id="field.name"
              :name="field.name"
              :model-value="field.state.value"
              :aria-invalid="isInvalid(field)"
              placeholder=""
              autocomplete="off"
              type="password"
              @blur="field.handleBlur"
              @input="field.handleChange($event.target.value)"
            />
          </InputGroup>
          <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
        </Field>
      </form.Field>

      <Button type="submit" size="lg" class="mt-4" @click="form.handleSubmit">Login</Button>
    </form>
  </main>
</template>
