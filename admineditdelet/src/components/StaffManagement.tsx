// src/components/StaffManagement.tsx (Add Staff Form Component)
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Staff {
  id?: number;
  name: string;
  role?: string;
  department?: string;
  location?: string;
  email?: string;
  phone?: string;
  status?: 'current' | 'former';
  yearOfService?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AddStaffMemberProps {
  onStaffAdded: () => void;
}

const StaffAdminForm: React.FC<AddStaffMemberProps> = ({ onStaffAdded }) => {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const departments = [
    "Board of Directors",
    "HR",
    "Sales",
    "Engineering",
    "Marketing",
    "Support",
  ]; // Example department options

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/staff",
        { name, role, department, location, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Staff member added.");
      setName("");
      setRole("");
      setDepartment("");
      setLocation("");
      setEmail("");
      onStaffAdded(); // refresh list in parent
    } catch {
      alert("Failed to add staff member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="block text-sm font-bold text-foreground">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="input h-12"
            placeholder="Enter full name..."
          />
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-bold text-foreground">
            Job Role
          </label>
          <input
            id="role"
            type="text"
            value={role}
            required
            onChange={(e) => setRole(e.target.value)}
            className="input h-12"
            placeholder="Enter job role..."
          />
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-bold text-foreground">
            Department
          </label>
          <select
            id="department"
            value={department}
            required
            onChange={(e) => setDepartment(e.target.value)}
            className="input h-12"
          >
            <option value="" disabled>
              Select department...
            </option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-bold text-foreground">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            required
            onChange={(e) => setLocation(e.target.value)}
            className="input h-12"
            placeholder="Enter location..."
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <label className="block text-sm font-bold text-foreground">
          Contact Information
        </label>
        <input
          id="contact"
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="input h-12"
          placeholder="Enter email address..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-gradient-primary hover:bg-gradient-hero text-primary-foreground px-10 py-6 h-auto font-bold text-lg shadow-glow hover:shadow-xl transition-all duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Adding Staff Member..." : "Add Staff Member"}
      </button>
    </form>
  );
};

export default StaffAdminForm;
