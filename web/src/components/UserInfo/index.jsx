/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useMemo, useCallback } from 'react';
// import { NavLink } from 'react-router-dom';
import { Dropdown, Menu, Button } from 'antd';

import { useAuth } from 'hooks/auth';

import './styles.less';

const UserInfo = () => {
  const { signOut, user } = useAuth();

  const logout = useCallback(() => {
    signOut();
  }, [signOut]);

  const menu = useMemo(
    () => (
      <Menu>
        <Menu.Item className="nav-link-users-container">
          <Button className="btn-logout" onClick={logout}>
            Sair
          </Button>
        </Menu.Item>
      </Menu>
    ),
    [logout]
  );

  return (
    <div id="user-info-component">
      <Dropdown
        overlay={menu}
        trigger={['click']}
        placement="bottomRight"
        overlayClassName="user-dropdown"
      >
        <div className="user-dropdown-trigger">
          <span>{user.email}</span>
          <i className="caf-ic_arrow_down" />
        </div>
      </Dropdown>
    </div>
  );
};

export default UserInfo;
