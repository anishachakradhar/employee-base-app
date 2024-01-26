import { withRouter } from 'react-router';
import { useSelector } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import { Link, useHistory } from 'react-router-dom';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ANNOUNCEMENTS_INDEX } from 'constants/routes';
import { deleteAnnouncement, fetchAnnouncementBySlug } from 'services/announcementServices';

const AnnouncementShow = (props) => {
  const { user: authUser } = useSelector((state) => state.data.auth);
  const isAdmin = authUser?.userAttributes.isAdmin;

  const [announcement, setAnnouncement] = useState([]);
  const { slug: selectedAnnouncementSlug } = props.match.params;
  const history = useHistory();

  const fetchAnnouncement = useCallback(async (selectedAnnouncementSlug) => {
    try {
      const { data } = await fetchAnnouncementBySlug(selectedAnnouncementSlug);
      setAnnouncement(data);
    } catch (error) {
      return history.push(ANNOUNCEMENTS_INDEX);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncement(selectedAnnouncementSlug);
  }, [selectedAnnouncementSlug]);

  const handleDelete = async (announcementId) => {
    try {
      await deleteAnnouncement(announcementId);
      return history.push(ANNOUNCEMENTS_INDEX);
    } catch (error) {
      return history.push(ANNOUNCEMENTS_INDEX);
    }
  };

  return (
    <div>
      <div className="header bg-primary pb-6">
        <div className="container-fluid">
          <div className="header-body">
            <div className="row align-items-center py-4">
              <div className="col-lg-6 col-7">
                <h6 className="h2 text-white mb-5">
                  <FontAwesomeIcon icon={faBullhorn} className="dashboard-icon mr-2" />
                  Announcements
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid mt--6">
        <div className="row">
          <div className="col-xl-1 order-xl-1"></div>
          <div className="col-xl-10 order-xl-1">
            <div className="card">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col-6">
                    <h3 className="mb-0 text-body">{announcement.title}</h3>
                  </div>
                  <div className="col-6 text-right">
                    <div>
                      <Link to={{ pathname: ANNOUNCEMENTS_INDEX }} className="btn btn-sm btn-outline-primary">
                        Back
                      </Link>
                    </div>
                    {isAdmin && (
                      <div className="mt-3">
                        <Link
                          to={{ pathname: `/announcements/${announcement.slug}/edit` }}
                          className="btn btn-sm btn-outline-info"
                        >
                          Edit
                        </Link>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(announcement.id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="pl-lg-4">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-group">
                        <div className="name mb-0 text-body description">
                          {ReactHtmlParser(announcement.description)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-1 order-xl-1"></div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(AnnouncementShow);
