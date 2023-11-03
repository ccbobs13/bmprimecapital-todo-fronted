<template>
  <v-container :fluid="true">
    <v-container class="d-flex align-center justify-center">
      <v-card class="pa-4" border variant="flat" width="600px" max-width="600px">
        <v-card-title class="text-center">TODO List</v-card-title>
        <v-card-text>

        </v-card-text>
        <v-card-text>
          <v-form ref="form" class="mb-4" fast-fail @submit.prevent="addTodos(todo)">
            <v-row>
              <v-col>
                <v-text-field
                  v-model="todo"
                  prepend-inner-icon="mdi-pencil"
                  color="primary"
                  variant="outlined"
                  density="compact"
                  required
                  :rules="todoRules"
                  label="Name">
                </v-text-field>
              </v-col>
              <v-col cols="2">
                <v-btn type="submit" color="primary" variant="tonal">
                  <v-icon icon="mdi-plus-circle"></v-icon>
                  Add
                </v-btn>
              </v-col>
            </v-row>
          </v-form>

          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center justify-start">
              <v-chip color="warning">Todos: {{ todos.length }}</v-chip>
            </div>
            <div>
              <v-chip class="me-2" color="primary" prepend-icon="mdi-filter" id="filter">{{ filterV }}</v-chip>
              <v-menu activator="#filter">
                <v-list density="compact" variant="flat" elevation="0" border>
                  <v-list-item @click="fetch">All</v-list-item>
                  <v-list-item @click="filter(true, 'Completed')">Completed</v-list-item>
                  <v-list-item @click="filter(false, 'Pending')">Pending</v-list-item>
                </v-list>
              </v-menu>
              <v-chip color="error" prepend-icon="mdi-close" @click="clearTodos">Clear</v-chip>
            </div>
          </div>
          <v-table
            fixed-header
            height="300px"
            v-if="todos.length > 0"
          >
            <thead>
            <tr>
              <th class="text-left" id="name">
                Name
              </th>
              <th class="text-left" id="status">
                Status
              </th>
              <th class="text-left" id="actions">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr
              v-for="todo in todos"
              :key="todo._id"
            >
              <td>
                <div class="d-flex flex-column">
                  <span :class="{'text-decoration-line-through' : todo.status }">{{ todo.name }}</span>
                  <span>Added: {{ dateF(todo.addedDate) }}</span>
                </div>
              </td>
              <td class="text-center">
                <v-checkbox-btn
                  v-model="todo.status" color="success"
                  @click.stop="updateTodoStatus(todo._id,!todo.status)">
                </v-checkbox-btn>
              </td>
              <td>
                <v-row>
                  <v-col>
                    <v-icon color="primary" icon="mdi-pencil" @click="openEdit(todo)" id="edit"></v-icon>
                    <v-dialog v-model="editDialog" max-width="400px">
                      <v-card>
                        <v-card-text>
                          <v-form ref="form" class="mb-4" fast-fail @submit.prevent="update(todo._id,todoEdit)">
                            <v-row>
                              <v-col>
                                <v-text-field
                                  v-model="todoEdit"
                                  prepend-inner-icon="mdi-pencil"
                                  color="primary"
                                  variant="outlined"
                                  density="compact"
                                  required
                                  :rules="todoRules"
                                  label="Name">
                                </v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col>
                                <v-btn type="submit" color="primary" variant="tonal">
                                  <v-icon icon="mdi-plus-circle"></v-icon>
                                  Update
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-form>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </v-col>
                  <v-col>
                    <v-icon color="error" icon="mdi-delete" @click="removeTodo(todo._id)"></v-icon>
                  </v-col>
                </v-row>
              </td>
            </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-container>

  </v-container>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {storeToRefs} from "pinia";
import {useTodoStore} from "@/store/todo";
import {ITodo} from "@/models/todo.model";

const form = ref()
const todo = ref('');
const todoEdit = ref('')
const filterV = ref('All');
const editDialog = ref(false);
const todoRules = [
  (value: string) => {
    if (value?.length > 3) return true
    return 'Name must be at least 3 characters.'
  },
]
const {todos} = storeToRefs(useTodoStore());
const {addTodo, fetchTodos, removeTodo, updateTodoStatus, updateTodo, clearTodos, filterByStatus} = useTodoStore();

onMounted(() => {
  fetchTodos();
})

const validate = async () => {
  const {valid} = await form.value.validate();
  return valid;
}

const reset = () => {
  form.value.reset()
}

const addTodos = async (todo: string) => {
  const valid = await validate();
  if (valid) {
    addTodo(todo);
    reset();
  }
}

const fetch = async () => {
  filterV.value = 'All';
  await fetchTodos();
}
const filter = async (status: boolean, filter: string) => {
  filterV.value = filter;
  await filterByStatus(status);
}

const update = async (id: string, name: string) => {
  updateTodo(id, name);
  editDialog.value = false;
}

const dateF = (d: Date) => {
  const date = new Date(d)
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

const openEdit = (todo: ITodo) => {
  todoEdit.value = todo.name;
  editDialog.value = true;
}

</script>
