export default {
  login: 'login',
  refresh: 'refresh',
  user: 'user',
  wfh: {
    list: 'wfh',
    apply: 'wfh/apply',
    requestedWfh: 'wfh/approve',
    statusUpdate: '/wfh/:id/update',
    show: 'wfh/{id}'
  },
  users: {
    all: 'users'
  },
  dhd: {
    list: 'health-declarations',
    create: 'health-declarations',
    show: 'health-declarations/{id}'
  },
  wfo: {
    list: 'wfos',
    apply: 'wfos',
    requestedWfo: 'wfos/approve',
    update: 'wfos/{id}',
    show: 'wfos/{id}'
  },
  announcement: {
    list: 'announcements',
    create: 'announcements',
    update: 'announcements/{id}',
    show: 'announcements/{slug}',
    delete: 'announcements/{id}'
  },
  attendance: {
    list: 'attendances'
  }
};
