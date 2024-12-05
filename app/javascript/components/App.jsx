import React, { useState, useRef } from 'react'
import JiraTicketForm from './JiraTicketForm'

const App = () => {
  const [formCount, setFormCount] = useState(1)
  const [notification, setNotification] = useState(null)
  const [allCollapsed, setAllCollapsed] = useState(false)
  const formRefs = useRef([])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const removeForm = (index) => {
    setFormCount(prev => prev - 1)
    setTimeout(() => updateAllCollapsedState(), 0)
  }

  const handleSingleSubmit = (formData) => {
    console.log('Single ticket submitted:', formData)
    showNotification('Successfully submitted ticket!')
  }

  const handleBulkSubmit = () => {
    const forms = formRefs.current.filter(ref => ref)
    const unsubmittedForms = forms.filter(ref => !ref.isSubmitted())
    
    if (unsubmittedForms.length === 0) {
      showNotification('All tickets have already been submitted', 'info')
      return
    }
    
    const allValid = unsubmittedForms.every(ref => ref.validate())
    
    if (allValid) {
      const allFormData = unsubmittedForms.map(ref => ref.getFormData())
      console.log('Submitting tickets:', allFormData)
      showNotification(`Successfully submitted ${allFormData.length} tickets!`)
      
      unsubmittedForms.forEach(ref => {
        ref.setSubmitted(true)
        ref.setCollapsed(true)
      })
    } else {
      showNotification('Please fill in all required fields', 'error')
    }
  }

  const updateAllCollapsedState = () => {
    setTimeout(() => {
      const forms = formRefs.current.filter(ref => ref)
      const allFormsCollapsed = forms.length > 0 && forms.every(ref => ref.isCollapsed())
      setAllCollapsed(allFormsCollapsed)
    }, 0)
  }

  const handleCollapseAll = () => {
    formRefs.current
      .filter(ref => ref)
      .forEach(ref => ref.setCollapsed(true))
    setAllCollapsed(true)
  }

  const handleExpandAll = () => {
    formRefs.current
      .filter(ref => ref)
      .forEach(ref => ref.setCollapsed(false))
    setAllCollapsed(false)
  }

  return (
    <div className="container mx-auto p-4 relative">
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded shadow-lg animate-fade-in ${
          notification.type === 'error' ? 'bg-red-500' : 
          notification.type === 'info' ? 'bg-blue-500' : 
          'bg-green-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      {[...Array(formCount)].map((_, index) => (
        <JiraTicketForm 
          key={index}
          ref={ref => formRefs.current[index] = ref}
          onRemove={() => removeForm(index)}
          showRemoveButton={formCount > 1}
          onSubmit={handleSingleSubmit}
          onCollapseChange={() => updateAllCollapsedState()}
        />
      ))}

      <div className="mt-4 flex gap-4">
        <button
          onClick={() => setFormCount(prev => prev + 1)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex-1"
        >
          + Add Another Ticket
        </button>

        <button
          onClick={handleBulkSubmit}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex-1"
        >
          Submit All Tickets
        </button>

        <button
          onClick={allCollapsed ? handleExpandAll : handleCollapseAll}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex-1"
        >
          {allCollapsed ? 'Expand All' : 'Collapse All'}
        </button>
      </div>
    </div>
  )
}

export default App 