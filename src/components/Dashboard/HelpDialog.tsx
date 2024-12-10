import React from 'react'; 
import './HelpDialog.css'; 
 
interface HelpDialogProps { 
  isOpen: boolean; 
  onClose: () => void; 
} 
 
const HelpDialog: React.FC<HelpDialogProps> = ({ isOpen, onClose }) => { 
  if (!isOpen) return null; 
 
  return ( 
    <div className="help-dialog-overlay"> 
      <div className="help-dialog"> 
        <button className="close-button" onClick={onClose}>×</button> 
        <h2>Dashboard Help Guide</h2> 
         
        <div className="help-content"> 
          <section> 
            <h3>Getting Started</h3> 
            <p>Welcome to your LifeMetrics dashboard! Here's how to use the main features:</p> 
          </section> 
 
          <section> 
            <h3>Status Types</h3> 
            <p>• Select from default metrics (Blood Pressure, Sleep Quality) or create custom ones using the "New Status" button in the left panel.</p> 
            <p>• Each status type has customizable thresholds to track your health metrics.</p> 
          </section> 
 
          <section> 
            <h3>Tracking Data</h3> 
            <p>• Enter new measurements using the input form at the top of the main panel.</p> 
            <p>• View your data through interactive charts showing distribution and trends.</p> 
            <p>• Recent records are displayed in a table below the charts.</p> 
          </section> 
 
          <section> 
            <h3>Profile Management</h3> 
            <p>• Update your profile picture and name through the "Edit Profile" option.</p> 
            <p>• Manage your account settings and password securely.</p> 
          </section> 
        </div> 
      </div> 
    </div> 
  ); 
}; 
 
export default HelpDialog;  