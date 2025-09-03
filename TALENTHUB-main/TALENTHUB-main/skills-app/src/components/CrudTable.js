import React from 'react';

function CrudTable({ entityName, fields, data, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead className="bg-gray-100">
          <tr>
            {fields.map((field) => (
              <th key={field.name} className="px-4 py-2 text-left">
                {field.label}
              </th>
            ))}
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              {fields.map((field) => (
                <td key={field.name} className="border px-4 py-2">
                  {item[field.name]}
                </td>
              ))}
              <td className="border px-4 py-2">
                <button
                  onClick={() => onEdit(item.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CrudTable;
