// Use a Toast Library

import { notify } from 'components/common/toast';

export function success({ title, message }) {
  notify({ type: 'success', message: { title, message } });
}

export function error({ title, message }) {
  notify({ type: 'danger', message: { title, message } });
}

export function warning({ title, message }) {
  notify({ type: 'warning', message: { title, message } });
}
