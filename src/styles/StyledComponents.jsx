import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const AuthCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
`;

export const Title = styled.h2`
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 300;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;


export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;

  @media (max-width: 480px) {
    gap: 16px;
  }
`;


export const InputGroup = styled.div`
  position: relative;
`;

export const Input = styled.input`
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #f8f9fa;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 12px 16px;
  }
`;


export const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 12px;
  }
`;


export const LinkButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  padding: 10px 0;
  transition: color 0.3s ease;

  &:hover {
    color: #764ba2;
  }
`;

export const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #c33;
  margin-bottom: 20px;
  font-size: 14px;
`;

export const SuccessMessage = styled.div`
  background: #efe;
  color: #3c3;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #3c3;
  margin-bottom: 20px;
  font-size: 14px;
`;

export const RoleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 20px 0;
`;

export const RoleCard = styled.div`
  padding: 15px 10px;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e1e5e9'};
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.selected ? '#f0f4ff' : '#f8f9fa'};

  &:hover {
    border-color: #667eea;
    background: #f0f4ff;
  }
`;

export const RoleIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
`;

export const RoleLabel = styled.div`
  font-size: 12px;
  color: #666;
  font-weight: 500;
`;

export const ContainerCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 92vh;
  background: linear-gradient(135deg, #ece9f3 0%, #f8f6fa 100%);
  padding: 20px;
  margin: 0;
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export const LoginCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: 0.3s ease;

  @media (max-width: 768px) {
    padding: 30px 20px;
    max-width: 90%;
  }

  @media (max-width: 480px) {
    padding: 25px 15px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SlotInfo = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SlotNumber = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 0.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const CancelButton = styled(Button)`
  background: #f8f9fa;
  color: #666;
  border: 2px solid #e1e5e9;
  
  &:hover {
    background: #e9ecef;
    border-color: #ced4da;
  }
`;

const ConfirmButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #c33;
  margin-bottom: 20px;
  font-size: 14px;
`;


const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 80px);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: bold;
`;

const SlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const SlotCard = styled.div`
  background: ${props => props.occupied ? '#ffebee' : '#e8f5e8'};
  border: 2px solid ${props => props.occupied ? '#f44336' : '#4caf50'};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  cursor: ${props => props.occupied ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: ${props => props.occupied ? 'none' : 'translateY(-4px)'};
    box-shadow: ${props => props.occupied ? '0 4px 6px rgba(0, 0, 0, 0.1)' : '0 8px 15px rgba(0, 0, 0, 0.2)'};
  }
`;

const SlotNumber = styled.h3`
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  color: ${props => props.occupied ? '#d32f2f' : '#388e3c'};
`;

const SlotStatus = styled.div`
  font-weight: bold;
  color: ${props => props.occupied ? '#d32f2f' : '#388e3c'};
  margin-bottom: 0.5rem;
`;

const VehicleInfo = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 3rem;
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 1000;
`;

const Notification = styled.div`
  background: #4caf50;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;


const NavbarContainer = styled.nav`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.h1`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
`;

const UserInfo = styled.div`
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 80px);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: bold;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e1e5e9;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #333;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background: #e8f5e8;
          color: #2e7d32;
          border: 1px solid #4caf50;
        `;
      case 'completed':
        return `
          background: #e3f2fd;
          color: #1565c0;
          border: 1px solid #2196f3;
        `;
      default:
        return `
          background: #f5f5f5;
          color: #666;
          border: 1px solid #ccc;
        `;
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyMessage = styled.h3`
  margin-bottom: 0.5rem;
  color: #333;
`;

const EmptySubtext = styled.p`
  color: #666;
  font-size: 0.9rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 3rem;
`;
