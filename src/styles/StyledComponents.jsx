// styles/StyledComponents.js
import styled from 'styled-components';

export const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

export const Header = styled.header`
  background: #2c3e50;
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
`;

export const NavBar = styled.nav`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

export const NavButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: ${props => props.active ? '#3498db' : '#ecf0f1'};
  color: ${props => props.active ? 'white' : '#333'};
  
  &:hover {
    background: ${props => props.active ? '#2980b9' : '#d5dbdb'};
  }
`;

export const ParkingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin: 20px 0;
`;

export const ParkingSlot = styled.div`
  padding: 20px;
  border: 2px solid ${props => props.occupied ? '#e74c3c' : '#27ae60'};
  border-radius: 8px;
  text-align: center;
  background: ${props => props.occupied ? '#ffebee' : '#e8f5e8'};
  cursor: ${props => props.occupied ? 'default' : 'pointer'};
  
  &:hover {
    background: ${props => props.occupied ? '#ffebee' : '#d4edda'};
  }
`;

export const FormContainer = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

export const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: #3498db;
  color: white;
  margin-right: 10px;
  
  &:hover {
    background: #2980b9;
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
`;

export const Th = styled.th`
  background: #34495e;
  color: white;
  padding: 12px;
  text-align: left;
`;

export const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
`;

export const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background: ${props => props.status === 'occupied' ? '#e74c3c' : '#27ae60'};
  color: white;
`;

export const StatsCard = styled.div`
  background: ${props => props.bgColor || '#3498db'};
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  
  h4 {
    margin: 0 0 10px 0;
  }
  
  .stat-number {
    font-size: 24px;
    font-weight: bold;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;