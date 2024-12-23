import React, { useState } from 'react';

const AutomationRulesPage = () => {
  const [ruleName, setRuleName] = useState('');
  const [conditions, setConditions] = useState([
    { type: 'sender_contains', value: '' },
  ]);
  const [actionType, setActionType] = useState('move_to_folder');
  const [actionValue, setActionValue] = useState('');
  const [priority, setPriority] = useState(0);
  const [rules, setRules] = useState([]);

  const addCondition = () => {
    setConditions([...conditions, { type: 'sender_contains', value: '' }]);
  };

  const deleteCondition = (index) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
  };

  const handleConditionChange = (index, key, value) => {
    const newConditions = [...conditions];
    newConditions[index][key] = value;
    setConditions(newConditions);
  };

  const createRule = () => {
    const newRule = {
      name: ruleName,
      conditions: conditions,
      actionType: actionType,
      actionValue: actionValue,
      priority: priority,
    };
    setRules([...rules, newRule]);
    resetForm();
  };

  const resetForm = () => {
    setRuleName('');
    setConditions([{ type: 'sender_contains', value: '' }]);
    setActionType('move_to_folder');
    setActionValue('');
    setPriority(0);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
        Email Automation Rule Creator
      </h1>

      {/* Rule Creator Form */}
      <div className="space-y-6">
        <div>
          <label className="block mb-1 font-medium text-gray-600">Rule Name</label>
          <input
            type="text"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            placeholder="Enter rule name"
            className="w-full border rounded-md p-2"
          />
        </div>

        <div className="border p-4 rounded-md">
          <h3 className="font-semibold mb-3">Conditions</h3>
          {conditions.map((condition, index) => (
            <div key={index} className="flex items-center gap-4 mb-2">
              <select
                value={condition.type}
                onChange={(e) =>
                  handleConditionChange(index, 'type', e.target.value)
                }
                className="border rounded-md p-2"
              >
                <option value="sender_contains">Sender Contains</option>
                <option value="subject_contains">Subject Contains</option>
                <option value="body_contains">Body Contains</option>
              </select>
              <input
                type="text"
                value={condition.value}
                onChange={(e) =>
                  handleConditionChange(index, 'value', e.target.value)
                }
                placeholder="Enter condition value"
                className="border rounded-md p-2 flex-1"
              />
              <button
                onClick={() => deleteCondition(index)}
                className="text-red-500 hover:text-red-700"
              >
                ❌
              </button>
            </div>
          ))}
          <button
            onClick={addCondition}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Add Condition
          </button>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-600">Actions</label>
          <select
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
            className="w-full border rounded-md p-2 mb-2"
          >
            <option value="move_to_folder">Move to Folder</option>
            <option value="forward_to">Forward To</option>
            <option value="mark_as_read">Mark as Read</option>
            <option value="delete">Delete Email</option>
          </select>
          <input
            type="text"
            value={actionValue}
            onChange={(e) => setActionValue(e.target.value)}
            placeholder="Enter action value"
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-600">Priority (0-10)</label>
          <input
            type="number"
            min="0"
            max="10"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border rounded-md p-2"
          />
        </div>

        <button
          onClick={createRule}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Create Rule
        </button>
      </div>

      {/* Rules List */}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Created Rules</h2>
        {rules.map((rule, index) => (
          <div
            key={index}
            className="border rounded-md p-4 mb-4 bg-gray-50 shadow-sm"
          >
            <h3 className="font-semibold text-lg">{rule.name}</h3>
            <p className="text-gray-700">
              <strong>Conditions:</strong>
              {rule.conditions.map((cond, i) => (
                <span key={i} className="ml-2">
                  {cond.type} = "{cond.value}"
                </span>
              ))}
            </p>
            <p className="text-gray-700">
              <strong>Action:</strong> {rule.actionType} → {rule.actionValue}
            </p>
            <p className="text-gray-700">
              <strong>Priority:</strong> {rule.priority}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutomationRulesPage;
