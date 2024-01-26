import http from 'utils/http';
import { format } from 'utils/datetime';
import { interpolate } from 'utils/string';
import endpoints from 'constants/endpoints';

export const announcementCreate = async (payload) => {
  const data = await http('POST', endpoints.announcement.create, {
    body: payload
  });
  return data;
};

export const formatCreateAnnouncementInput = (input) => {
  return {
    startDate: format(input.startDate),
    endDate: format(input.endDate),
    title: input.title,
    description: input.description
  };
};

export const getAnnouncements = async (params) => {
  const { data } = await http('GET', endpoints.announcement.list, { params });
  return data;
};

export const updateAnnouncement = async (announcementId, formData) => {
  const { data } = await http('PUT', interpolate(endpoints.announcement.update, announcementId), {
    body: {
      startDate: formData.startDate,
      endDate: formData.endDate,
      title: formData.title,
      description: formData.description
    }
  });

  return data;
};

export const fetchAnnouncementBySlug = async (announcementSlug) => {
  const { data } = await http('GET', interpolate(endpoints.announcement.show, announcementSlug));
  return data;
};

export const deleteAnnouncement = async (announcementId) => {
  await http('DELETE', interpolate(endpoints.announcement.delete, announcementId));
  return;
};
