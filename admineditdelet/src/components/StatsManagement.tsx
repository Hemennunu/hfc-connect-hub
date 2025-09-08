import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Edit3, Save, X, Plus, BarChart3, TrendingUp } from 'lucide-react';
import StatsPreview from './StatsPreview';

interface StatItem {
  id: number;
  number: string;
  label: string;
  icon?: string;
  color?: 'blue' | 'green' | 'orange' | 'purple';
  secondaryNumber?: string;
  secondaryLabel?: string;
  additionalNumbers?: string[];
  additionalLabel?: string;
  isActive?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

type StatInput = Omit<StatItem, 'id' | 'createdAt' | 'updatedAt'>;

interface StatsManagementProps {
  refreshTrigger: number;
}

const StatsManagement: React.FC<StatsManagementProps> = ({ refreshTrigger }) => {
  const { token } = useAuth();
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStat, setEditingStat] = useState<StatItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStat, setNewStat] = useState<StatInput>({
    number: '',
    label: '',
    icon: 'circle',
    color: 'blue',
    secondaryNumber: '',
    secondaryLabel: '',
    additionalNumbers: [],
    additionalLabel: '',
    isActive: true,
    order: 0
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = (data: StatInput): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!data.number.trim()) {
      newErrors.number = 'Number is required';
    }
    
    if (!data.label.trim()) {
      newErrors.label = 'Label is required';
    }

    if (!data.icon?.trim()) {
      newErrors.icon = 'Icon is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setStats(response.data.sort((a: StatItem, b: StatItem) => (a.order || 0) - (b.order || 0)));
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const startEditing = (stat: StatItem) => {
    setEditingStat({
      ...stat
    });
  };

  const handleSave = async () => {
    if (!editingStat) return;
    
    try {
      if (!editingStat.number || !editingStat.label) {
        alert('Please fill in all required fields');
        return;
      }

      const statToUpdate = {
        number: editingStat.number,
        label: editingStat.label,
        icon: editingStat.icon,
        color: editingStat.color,
        secondaryNumber: editingStat.secondaryNumber,
        secondaryLabel: editingStat.secondaryLabel,
        additionalNumbers: editingStat.additionalNumbers,
        additionalLabel: editingStat.additionalLabel,
        isActive: editingStat.isActive,
        order: editingStat.order
      };

      const response = await axios.put(
        `http://localhost:5000/api/stats/${editingStat.id}`,
        statToUpdate,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setStats(stats.map(stat => 
        stat.id === editingStat.id ? response.data : stat
      ));
      setEditingStat(null);
    } catch (error: any) {
      console.error('Error updating stat:', error);
      alert(`Error updating stat: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this statistic?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/stats/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setStats(stats.filter(stat => stat.id !== id));
    } catch (error: any) {
      console.error('Error deleting stat:', error);
      alert('Error deleting stat. Please try again.');
    }
  };

  const handleAddStat = async () => {
    if (!validateForm(newStat)) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/stats', newStat, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setStats([...stats, response.data]);
      setNewStat({
        number: '',
        label: '',
        icon: 'circle',
        color: 'blue',
        secondaryNumber: '',
        secondaryLabel: '',
        additionalNumbers: [],
        additionalLabel: '',
        isActive: true,
        order: stats.length > 0 ? Math.max(...stats.map(s => s.order || 0)) + 1 : 0
      });
      setShowAddForm(false);
      setErrors({});
    } catch (error: any) {
      console.error('Error adding stat:', error);
      alert(`Error adding stat: ${error.response?.data?.message || error.message}`);
    }
  };

  const toggleActive = async (stat: StatItem) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/stats/${stat.id}/toggle`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setStats(stats.map(s => 
        s.id === stat.id ? response.data : s
      ));
    } catch (error) {
      console.error('Error toggling stat status:', error);
      alert('Error toggling stat status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Statistics Management</h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Statistic</span>
        </button>
      </div>

      {/* Live Preview */}
      <StatsPreview stats={stats} title="Client Website Preview" />

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Add New Statistic</h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setErrors({});
                setNewStat({
                  number: '',
                  label: '',
                  icon: 'circle',
                  color: 'blue',
                  secondaryNumber: '',
                  secondaryLabel: '',
                  additionalNumbers: [],
                  additionalLabel: '',
                  isActive: true,
                  order: 0
                });
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number *</label>
              <input
                type="text"
                value={newStat.number}
                onChange={(e) => {
                  setNewStat({...newStat, number: e.target.value});
                  if (errors.number) setErrors({...errors, number: ''});
                }}
                className={`w-full p-2 border ${
                  errors.number ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                placeholder="e.g., 37,000+"
              />
              {errors.number && (
                <p className="mt-1 text-sm text-red-600">{errors.number}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
              <input
                type="text"
                value={newStat.label}
                onChange={(e) => {
                  setNewStat({...newStat, label: e.target.value});
                  if (errors.label) setErrors({...errors, label: ''});
                }}
                className={`w-full p-2 border ${
                  errors.label ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                placeholder="e.g., OVC & PLWHA Reached"
              />
              {errors.label && (
                <p className="mt-1 text-sm text-red-600">{errors.label}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
              <select
                value={newStat.icon}
                onChange={(e) => setNewStat({...newStat, icon: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="circle">Circle</option>
                <option value="users">Users</option>
                <option value="heart">Heart</option>
                <option value="globe">Globe</option>
                <option value="check">Check</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <select
                value={newStat.color}
                onChange={(e) => setNewStat({...newStat, color: e.target.value as 'blue' | 'green' | 'orange' | 'purple'})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="orange">Orange</option>
                <option value="purple">Purple</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Number</label>
              <input
                type="text"
                value={newStat.secondaryNumber || ''}
                onChange={(e) => setNewStat({...newStat, secondaryNumber: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 1,200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Label</label>
              <input
                type="text"
                value={newStat.secondaryLabel || ''}
                onChange={(e) => setNewStat({...newStat, secondaryLabel: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., New Beneficiaries"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Label</label>
              <input
                type="text"
                value={newStat.additionalLabel || ''}
                onChange={(e) => setNewStat({...newStat, additionalLabel: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Communities Served"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <input
                type="number"
                min="0"
                value={newStat.order}
                onChange={(e) => setNewStat({...newStat, order: parseInt(e.target.value) || 0})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={newStat.isActive}
                onChange={(e) => setNewStat({...newStat, isActive: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Numbers (comma-separated)</label>
              <input
                type="text"
                value={newStat.additionalNumbers?.join(', ') || ''}
                onChange={(e) => {
                  const numbers = e.target.value.split(',').map(n => n.trim()).filter(n => n);
                  setNewStat({...newStat, additionalNumbers: numbers});
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 500, 25, 150"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setErrors({});
                setNewStat({
                  number: '',
                  label: '',
                  icon: 'circle',
                  color: 'blue',
                  secondaryNumber: '',
                  secondaryLabel: '',
                  additionalNumbers: [],
                  additionalLabel: '',
                  isActive: true,
                  order: 0
                });
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors border border-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddStat}
              disabled={!newStat.number.trim() || !newStat.label.trim()}
              className={`px-6 py-2 rounded-md transition-colors flex items-center ${
                !newStat.number.trim() || !newStat.label.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Statistic
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingStat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Statistic</h2>
              <button
                onClick={() => setEditingStat(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Live Preview in Edit Modal */}
            <StatsPreview 
              stats={stats.map(s => s.id === editingStat.id ? editingStat : s)} 
              title="Preview with Your Changes" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number *</label>
                <input
                  type="text"
                  value={editingStat.number}
                  onChange={(e) => setEditingStat({...editingStat, number: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 37,000+"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
                <input
                  type="text"
                  value={editingStat.label}
                  onChange={(e) => setEditingStat({...editingStat, label: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., OVC & PLWHA Reached"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select
                  value={editingStat.icon}
                  onChange={(e) => setEditingStat({...editingStat, icon: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="circle">Circle</option>
                  <option value="users">Users</option>
                  <option value="heart">Heart</option>
                  <option value="globe">Globe</option>
                  <option value="check">Check</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <select
                  value={editingStat.color}
                  onChange={(e) => setEditingStat({...editingStat, color: e.target.value as 'blue' | 'green' | 'orange' | 'purple'})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="orange">Orange</option>
                  <option value="purple">Purple</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Number</label>
                <input
                  type="text"
                  value={editingStat.secondaryNumber || ''}
                  onChange={(e) => setEditingStat({...editingStat, secondaryNumber: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 1,200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Label</label>
                <input
                  type="text"
                  value={editingStat.secondaryLabel || ''}
                  onChange={(e) => setEditingStat({...editingStat, secondaryLabel: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., New Beneficiaries"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Label</label>
                <input
                  type="text"
                  value={editingStat.additionalLabel || ''}
                  onChange={(e) => setEditingStat({...editingStat, additionalLabel: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Communities Served"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  min="0"
                  value={editingStat.order}
                  onChange={(e) => setEditingStat({...editingStat, order: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editingStat.isActive}
                  onChange={(e) => setEditingStat({...editingStat, isActive: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="editIsActive" className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Numbers (comma-separated)</label>
                <input
                  type="text"
                  value={editingStat.additionalNumbers?.join(', ') || ''}
                  onChange={(e) => {
                    const numbers = e.target.value.split(',').map(n => n.trim()).filter(n => n);
                    setEditingStat({...editingStat, additionalNumbers: numbers});
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 500, 25, 150"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingStat(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors border border-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!editingStat.number.trim() || !editingStat.label.trim()}
                className={`px-6 py-2 rounded-md transition-colors flex items-center ${
                  !editingStat.number.trim() || !editingStat.label.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statistic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.map((stat) => (
                <tr key={stat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{stat.label}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-lg font-bold text-blue-600">{stat.number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{stat.order || 0}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(stat)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        stat.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {stat.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditing(stat)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit statistic"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(stat.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete statistic"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {stats.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No statistics found. Add your first statistic to get started.
        </div>
      )}
    </div>
  );
};

export default StatsManagement;
