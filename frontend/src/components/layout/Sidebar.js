import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiSearch, 
  FiPlay, 
  FiBookmark, 
  FiUser,
} from 'react-icons/fi';

const SidebarContainer = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg} 0;
  height: 100%;
  background: linear-gradient(180deg, 
    ${({ theme }) => theme.colors.primary} 0%, 
    ${({ theme }) => theme.colors.secondary} 100%);
`;

const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 40px;
    height: 40px;
  }
`;

const AvatarIcon = styled(FiUser)`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 20px;
  }
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  flex: 1;
`;

const NavItem = styled.li`
  list-style: none;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ active, theme }) => 
    active ? theme.colors.accent : 'transparent'};
  color: ${({ active, disabled, theme }) => 
    disabled ? theme.colors.text.muted : 
    active ? theme.colors.text.primary : theme.colors.text.secondary};
  border: none;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};

  &:hover {
    background: ${({ disabled, theme }) => 
      disabled ? 'transparent' : theme.colors.accent};
    color: ${({ disabled, theme }) => 
      disabled ? theme.colors.text.muted : theme.colors.text.primary};
    transform: ${({ disabled }) => disabled ? 'none' : 'translateX(2px)'};
  }

  &:active {
    transform: ${({ disabled }) => disabled ? 'none' : 'scale(0.95)'};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 40px;
    height: 40px;
  }
`;

const NavIcon = styled.div`
  font-size: 20px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 18px;
  }
`;


const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      id: 'home',
      icon: FiHome,
      path: '/',
      label: 'Home',
      active: true
    },
    {
      id: 'search',
      icon: FiSearch,
      path: '/search',
      label: 'Buscar',
      active: true
    },
    {
      id: 'trending',
      icon: FiPlay,
      path: null,
      label: 'Em Alta',
      active: false
    },
    {
      id: 'favorites',
      icon: FiBookmark,
      path: null,
      label: 'Favoritos',
      active: false
    }
  ];

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarContainer>
      <UserAvatar>
        <AvatarIcon />
      </UserAvatar>

      <NavList>
        {navItems.map((item) => (
          <NavItem key={item.id}>
            <NavButton
              active={item.active && isActive(item.path)}
              disabled={!item.active}
              onClick={() => handleNavigation(item.path)}
              title={item.label}
              aria-label={item.label}
            >
              <NavIcon>
                <item.icon />
              </NavIcon>
            </NavButton>
          </NavItem>
        ))}
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar; 