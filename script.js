document.addEventListener('DOMContentLoaded', function() {
    // Initialize form elements from sample JSON data
    const initialFormElements = [
        {
            "id": "c0ac49c5-871e-4c72-a878-251de465e6b4",
            "type": "input",
            "label": "Sample Input",
            "placeholder": "Sample placeholder"
        },
        {
            "id": "146e69c2-1630-4a27-9d0b-f09e463a66e4",
            "type": "select",
            "label": "Sample Select",
            "options": ["Sample Option", "Sample Option", "Sample Option"]
        },
        {
            "id": "45002ecf-85cf-4852-bc46-529f94a758f5",
            "type": "textarea",
            "label": "Sample Textarea",
            "placeholder": "Sample Placeholder"
        },
        {
            "id": "680cff8d-c7f9-40be-8767-e3d6ba420952",
            "type": "checkbox",
            "label": "Sample Checkbox"
        }
    ];

    const forms = document.getElementById('formElements');
    const theme = document.getElementById('theme');
    const modal = document.getElementById('previewModal');
    const closeModal = document.querySelector('.close');
    const copybtn = document.getElementById('copyHtml');
    const preview = document.getElementById('preview');

    // Global state
    let formElements = [];

    // Load initial data
    formElements = initialFormElements;
    renderFormElements();

    // Sortable functionality
    const sortable = new Sortable(forms, {
        animation: 150,
        ghostClass: 'ghost',
        handle: '.drag-handle',
        onEnd: function(evt) {
            const itemEl = evt.item;
            const fromIndex = evt.oldIndex;
            const toIndex = evt.newIndex;
            
            // Update the formElements array
            const element = formElements.splice(fromIndex, 1)[0];
            formElements.splice(toIndex, 0, element);
        }
    });

    // Theme toggle
    theme.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode', this.checked);
    });

    // Add event listeners for element buttons
    document.getElementById('addInput').addEventListener('click', () => addNewElement('input'));
    document.getElementById('addSelect').addEventListener('click', () => addNewElement('select'));
    document.getElementById('addTextarea').addEventListener('click', () => addNewElement('textarea'));
    document.getElementById('addCheckbox').addEventListener('click', () => addNewElement('checkbox'));
    document.getElementById('saveForm').addEventListener('click', saveForm);
    document.getElementById('prev').addEventListener('click', prev);

    // Close modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Copy HTML button
    copybtn.addEventListener('click', function() {
        const htmlContent = preview.innerHTML;
        navigator.clipboard.writeText(htmlContent).then(function() {
            alert('HTML copied to clipboard');
        }, function(err) {
            console.error('Could not copy text: ', err);
        });
    });

    // Functions
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function addNewElement(type) {
        const newElement = {
            id: generateUUID(),
            type: type,
            label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`
        };

        if (type === 'input' || type === 'textarea') {
            newElement.placeholder = 'Enter placeholder text';
        } else if (type === 'select') {
            newElement.options = ['Option 1', 'Option 2', 'Option 3'];
        }

        formElements.push(newElement);
        renderFormElements();
    }

    function renderFormElements() {
        forms.innerHTML = '';
        
        formElements.forEach((element, index) => {
            const elementDiv = document.createElement('div');
            elementDiv.className = 'form-element';
            elementDiv.dataset.id = element.id;
            
            const elementHeader = document.createElement('div');
            elementHeader.className = 'element-header';
            
            const dragHandle = document.createElement('span');
            dragHandle.className = 'drag-handle';
            dragHandle.innerHTML = '⋮';
            elementHeader.appendChild(dragHandle);
            
            const elementTitle = document.createElement('div');
            elementTitle.className = 'element-title';
            elementTitle.textContent = element.type.charAt(0).toUpperCase() + element.type.slice(1);
            elementHeader.appendChild(elementTitle);
            
            const elementActions = document.createElement('div');
            elementActions.className = 'element-actions';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '🗑️';
            deleteBtn.addEventListener('click', () => deleteElement(element.id));
            elementActions.appendChild(deleteBtn);
            
            elementHeader.appendChild(elementActions);
            elementDiv.appendChild(elementHeader);
            
            // Element-specific content
            const contentDiv = document.createElement('div');
            contentDiv.className = 'element-content';
            
            // Label input
            const labelGroup = document.createElement('div');
            labelGroup.className = 'input-group';
            
            const labelLabel = document.createElement('label');
            labelLabel.textContent = 'Label:';
            labelGroup.appendChild(labelLabel);
            
            const labelInput = document.createElement('input');
            labelInput.type = 'text';
            labelInput.value = element.label;
            labelInput.addEventListener('input', (e) => updateElementProperty(element.id, 'label', e.target.value));
            labelGroup.appendChild(labelInput);
            
            contentDiv.appendChild(labelGroup);
            
            // Type-specific options
            if (element.type === 'input' || element.type === 'textarea') {
                const placeholderGroup = document.createElement('div');
                placeholderGroup.className = 'input-group';
                
                const placeholderLabel = document.createElement('label');
                placeholderLabel.textContent = 'Placeholder:';
                placeholderGroup.appendChild(placeholderLabel);
                
                const placeholderInput = document.createElement('input');
                placeholderInput.type = 'text';
                placeholderInput.value = element.placeholder || '';
                placeholderInput.addEventListener('input', (e) => updateElementProperty(element.id, 'placeholder', e.target.value));
                placeholderGroup.appendChild(placeholderInput);
                
                contentDiv.appendChild(placeholderGroup);
            } else if (element.type === 'select') {
                const optionsGroup = document.createElement('div');
                optionsGroup.className = 'options-group';
                
                const optionsLabel = document.createElement('label');
                optionsLabel.textContent = 'Options:';
                optionsGroup.appendChild(optionsLabel);
                
                const optionsList = document.createElement('div');
                optionsList.className = 'option-list';
                
                element.options.forEach((option, optionIndex) => {
                    const optionItem = document.createElement('div');
                    optionItem.className = 'option-item';
                    
                    const optionSpan = document.createElement('span');
                    optionSpan.textContent = option;
                    optionItem.appendChild(optionSpan);
                    
                    const deleteOptionBtn = document.createElement('button');
                    deleteOptionBtn.textContent = '✕';
                    deleteOptionBtn.addEventListener('click', () => deleteOption(element.id, optionIndex));
                    optionItem.appendChild(deleteOptionBtn);
                    
                    optionsList.appendChild(optionItem);
                });
                
                optionsGroup.appendChild(optionsList);
                
                const addOptionBtn = document.createElement('button');
                addOptionBtn.className = 'add-option';
                addOptionBtn.textContent = '+ Add Option';
                addOptionBtn.addEventListener('click', () => addOption(element.id));
                optionsGroup.appendChild(addOptionBtn);
                
                contentDiv.appendChild(optionsGroup);
            }
            
            elementDiv.appendChild(contentDiv);
            forms.appendChild(elementDiv);
        });
    }

    function updateElementProperty(id, property, value) {
        const elementIndex = formElements.findIndex(el => el.id === id);
        if (elementIndex !== -1) {
            formElements[elementIndex][property] = value;
        }
    }

    function deleteElement(id) {
        formElements = formElements.filter(el => el.id !== id);
        renderFormElements();
    }

    function addOption(elementId) {
        const elementIndex = formElements.findIndex(el => el.id === elementId);
        if (elementIndex !== -1) {
            const newOption = `Option ${formElements[elementIndex].options.length + 1}`;
            formElements[elementIndex].options.push(newOption);
            renderFormElements();
        }
    }

    function deleteOption(elementId, optionIndex) {
        const elementIndex = formElements.findIndex(el => el.id === elementId);
        if (elementIndex !== -1) {
            formElements[elementIndex].options.splice(optionIndex, 1);
            renderFormElements();
        }
    }

    function saveForm() {
        console.log(JSON.stringify(formElements, null, 2));
        alert('Form saved successfully! Check the console for JSON data.');
    }

    function prev() {
        preview.innerHTML = '';
        
        const prev = document.createElement('form');
        
        formElements.forEach(element => {
            const formGroup = document.createElement('div');
            formGroup.style.marginBottom = '15px';
            
            const label = document.createElement('label');
            label.textContent = element.label;
            label.style.display = 'block';
            label.style.marginBottom = '5px';
            formGroup.appendChild(label);
            
            if (element.type === 'input') {
                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = element.placeholder || '';
                input.style.width = '100%';
                input.style.padding = '8px';
                input.style.borderRadius = '4px';
                input.style.border = '1px solid #ccc';
                formGroup.appendChild(input);
            } else if (element.type === 'textarea') {
                const textarea = document.createElement('textarea');
                textarea.placeholder = element.placeholder || '';
                textarea.rows = 4;
                textarea.style.width = '100%';
                textarea.style.padding = '8px';
                textarea.style.borderRadius = '4px';
                textarea.style.border = '1px solid #ccc';
                formGroup.appendChild(textarea);
            } else if (element.type === 'select') {
                const select = document.createElement('select');
                select.style.width = '100%';
                select.style.padding = '8px';
                select.style.borderRadius = '4px';
                select.style.border = '1px solid #ccc';
                
                element.options.forEach(option => {
                    const optionEl = document.createElement('option');
                    optionEl.textContent = option;
                    optionEl.value = option;
                    select.appendChild(optionEl);
                });
                
                formGroup.appendChild(select);
            } else if (element.type === 'checkbox') {
                const checkboxContainer = document.createElement('div');
                checkboxContainer.style.display = 'flex';
                checkboxContainer.style.alignItems = 'center';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.style.marginRight = '8px';
                
                checkboxContainer.appendChild(checkbox);
                formGroup.appendChild(checkboxContainer);
            }
            
            prev.appendChild(formGroup);
        });
        
        const submitbtn = document.createElement('button');
        submitbtn.type = 'button';
        submitbtn.textContent = 'Submit';
        submitbtn.style.padding = '10px 15px';
        submitbtn.style.backgroundColor = '#4a6ee0';
        submitbtn.style.color = 'white';
        submitbtn.style.border = 'none';
        submitbtn.style.borderRadius = '4px';
        submitbtn.style.cursor = 'pointer';
        
        prev.appendChild(submitbtn);
        preview.appendChild(prev);
        
        modal.style.display = 'block';
    }
});
