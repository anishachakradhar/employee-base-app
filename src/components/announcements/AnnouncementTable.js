import { withRouter } from 'react-router';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { format } from 'utils/datetime';
import { ANNOUNCEMENTS_CREATE, ANNOUNCEMENTS_INDEX } from 'constants/routes';
import { deleteAnnouncement, getAnnouncements } from 'services/announcementServices';

const AnnouncementTable = () => {
  const { user: authUser } = useSelector((state) => state.data.auth);
  const isAdmin = authUser?.userAttributes.isAdmin;

  const [announcements, setAnnouncements] = useState([]);

  const history = useHistory();

  const fetchAnnouncements = useCallback(async () => {
    const { data } = await getAnnouncements();
    setAnnouncements(data);
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (announcementId) => {
    try {
      await deleteAnnouncement(announcementId);
      fetchAnnouncements();
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
          <div className="card col-12">
            <div className="card-header row border-0">
              <div className="col-6">
                <h3 className="mb-0 text-body">All Announcements</h3>
              </div>
              <div className="col-6 text-right">
                {isAdmin && (
                  <Link className="btn btn-sm btn-success btn-custom-size" to={{ pathname: ANNOUNCEMENTS_CREATE }}>
                    Add Announcement
                  </Link>
                )}
              </div>
            </div>
            <div className="table-responsive">
              <table className="table align-items-center table-flush">
                <thead>
                  <tr>
                    <th scope="col" className="sort">
                      S.N
                    </th>
                    {isAdmin && (
                      <th scope="col" className="sort">
                        Start Date
                      </th>
                    )}
                    {isAdmin && (
                      <th scope="col" className="sort">
                        End Date
                      </th>
                    )}
                    <th scope="col" className="sort">
                      Title
                    </th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody className="list">
                  {announcements &&
                    announcements.map((announcement, index) => (
                      <tr key={index}>
                        <th scope="row">
                          <div className="media align-items-center">
                            <div className="media-body">
                              <span className="name mb-0 text-sm">{index + 1}</span>
                            </div>
                          </div>
                        </th>
                        {isAdmin && (
                          <td scope="row">
                            <div className="media align-items-center">
                              <div className="media-body">
                                <span className="name mb-0 text-sm">{format(announcement.start_date)}</span>
                              </div>
                            </div>
                          </td>
                        )}
                        {isAdmin && (
                          <td scope="row">
                            <div className="media align-items-center">
                              <div className="media-body">
                                <span className="name mb-0 text-sm">{format(announcement.end_date)}</span>
                              </div>
                            </div>
                          </td>
                        )}
                        <th scope="row">
                          <div className="media align-items-center">
                            <div className="media-body">
                              <span className="name mb-0 text-sm">{announcement.title}</span>
                            </div>
                          </div>
                        </th>
                        <td>
                          <Link
                            type="button"
                            className="btn btn-sm btn-outline-success"
                            to={{ pathname: `/announcements/${announcement.slug}` }}
                          >
                            View
                          </Link>
                          {isAdmin && (
                            <span>
                              <Link
                                type="button"
                                className="btn btn-sm btn-outline-info"
                                to={{ pathname: `/announcements/${announcement.slug}/edit` }}
                              >
                                Edit
                              </Link>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(announcement.id)}
                              >
                                Delete
                              </button>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(AnnouncementTable);
