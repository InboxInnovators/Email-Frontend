import React, { useEffect, useState } from 'react';
import useStore from '../useStore';
import axios from 'axios';
import { Plus, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RulesPage = () => {
    const { accessToken } = useStore((state) => state);
    const [rules, setRules] = useState([]);
    const navigate = useNavigate();

    // Fetch all rules from the Graph API
    const getAllRules = async (token) => {
        try {
            const response = await axios.get(
                'https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messageRules',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            let data = response.data;
            console.log(data.value);
            return data.value; // Return the rules for further processing
        } catch (error) {
            console.error('Error fetching rules:', error);
            throw error;
        }
    };

    // Create a new rule
    const createRule = async (token, body) => {
        token = token.trim();
        try {
            const response = await axios.post(
                'https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messageRules',
                body,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            console.log('Rule created:', response.data);
            return response.data; // Return the created rule for further processing
        } catch (error) {
            console.error('Error creating rule:', error);
            throw error;
        }
    };

    // Delete a rule by ID
    const deleteRule = async (ruleId, token) => {
        try {
            const response = await axios.delete(
                `https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messageRules/${ruleId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Rule deleted:', response);
        } catch (error) {
            console.error('Error deleting rule:', error);
            throw error;
        }
    };

    // Fetch rules on component mount
    useEffect(() => {
        const fetchRules = async () => {
            try {
                const fetchedRules = await getAllRules(accessToken); // Call getAllRules to fetch existing rules
                setRules(fetchedRules);
            } catch (error) {
                console.error('Failed to fetch rules:', error);
            }
        };

        fetchRules();
    }, [accessToken]); // Ensure it runs on page load

    const handleCreateRule = async (newRule) => {
        try {
            const createdRule = await createRule(accessToken, newRule);
            setRules((prevRules) => [...prevRules, createdRule]); // Update state with the new rule
        } catch (error) {
            console.error('Failed to create rule:', error);
        }
    };

    const handleDeleteRule = async (ruleId) => {
        try {
            await deleteRule(ruleId, accessToken);
            setRules((prevRules) => prevRules.filter(rule => rule.id !== ruleId)); // Remove the deleted rule from state
        } catch (error) {
            console.error('Failed to delete rule:', error);
        }
    };


  const [conditions, setConditions] = useState([]);
  const [actions, setActions] = useState([]);
  const [ruleName, setRuleName] = useState('');

  const conditionOptions = [
    { value: 'subjectContains', label: 'Subject Contains' },
    { value: 'bodyContains', label: 'Body Contains' },
    { value: 'fromAddresses', label: 'From Addresses' },
    { value: 'importance', label: 'Importance' }
  ];

  const actionOptions = [
    { value: 'moveToFolder', label: 'Move to Folder' },
    { value: 'delete', label: 'Delete' },
    { value: 'forwardTo', label: 'Forward To' },
    { value: 'markAsRead', label: 'Mark as Read' }
  ];

  const addCondition = () => {
    setConditions([...conditions, { type: '', value: '' }]);
  };

  const addAction = () => {
    setActions([...actions, { type: '', value: '' }]);
  };

  const updateCondition = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setConditions(newConditions);
  };

  const updateAction = (index, field, value) => {
    const newActions = [...actions];
    newActions[index] = { ...newActions[index], [field]: value };
    setActions(newActions);
  };

  const handleSubmit = async () => {
    if (!ruleName) {
      console.log('Please enter the rule name');
      return;
    }

    const conditionContainer = {};
    const actionContainer = {};

    conditions.forEach(({ type, value }) => {
      if (type && value) {
        if (['subjectContains', 'bodyContains'].includes(type)) {
          conditionContainer[type] = conditionContainer[type] 
            ? [...conditionContainer[type], value]
            : [value];
        } else if (['fromAddresses', 'toRecipients'].includes(type)) {
          conditionContainer[type] = conditionContainer[type]
            ? [...conditionContainer[type], { emailAddress: value }]
            : [{ emailAddress: value }];
        } else {
          conditionContainer[type] = value;
        }
      }
    });

    actions.forEach(({ type, value }) => {
      if (type && value) {
        if (type === 'delete') {
          actionContainer[type] = true; // Set delete action to true
        } else if (type === 'forwardTo') {
          actionContainer[type] = actionContainer[type]
            ? [...actionContainer[type], { emailAddress: { address: value } }]
            : [{ emailAddress: { address: value } }];
        } else if (type === 'markAsRead') {
          actionContainer[type] = true; // Set markAsRead action to true
        } else {
          actionContainer[type] = value;
        }
      }
    });

    const ruleBody = {
      displayName: ruleName,
      sequence: 1,
      isEnabled: true,
      conditions: conditionContainer,
      actions: actionContainer
    };

    console.log('Rule body:', ruleBody);

    try {
      const createdRule = await createRule(accessToken, ruleBody);
      console.log('Rule created:', createdRule);
    } catch (error) {
      console.error('Failed to create rule:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6">
          <button
            onClick={() => navigate('/emails')}
            className="mb-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Emails
          </button>
          <h2 className="text-2xl font-bold mb-6">Rule Management</h2>
          
          <div className="space-y-6">
            {/* Rule Name */}
            <div className="space-y-2">
              <label htmlFor="rule-name" className="block text-sm font-medium text-gray-700">
                Rule Name
              </label>
              <input
                id="rule-name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter rule name"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
              />
            </div>

            {/* Conditions */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Conditions
                </label>
                <button
                  onClick={addCondition}
                  className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Condition
                </button>
              </div>
              <div className="space-y-3">
                {conditions.map((condition, index) => (
                  <div key={index} className="flex gap-3">
                    <select
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={condition.type}
                      onChange={(e) => updateCondition(index, 'type', e.target.value)}
                    >
                      <option value="">Select a condition</option>
                      {conditionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter value"
                      value={condition.value}
                      onChange={(e) => updateCondition(index, 'value', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Actions
                </label>
                <button
                  onClick={addAction}
                  className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Action
                </button>
              </div>
              <div className="space-y-3">
                {actions.map((action, index) => (
                  <div key={index} className="flex gap-3">
                    <select
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={action.type}
                      onChange={(e) => updateAction(index, 'type', e.target.value)}
                    >
                      <option value="" disabled>Select an action</option>
                      {actionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter value"
                      value={action.value}
                      onChange={(e) => updateAction(index, 'value', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;