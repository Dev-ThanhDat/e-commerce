import Select from 'react-select';

const DropdownCategory = ({ options, onChange, value, inputId }) => {
  return (
    <Select
      inputId={inputId}
      options={options}
      value={value}
      onChange={onChange}
      placeholder='Chọn danh mục'
      styles={{
        control: (base) => ({
          ...base,
          backgroundColor: '#f5f5f5',
          border: 'none',
          boxShadow: 'none',
          cursor: 'pointer',
          ':hover': {
            border: 'none'
          }
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: '#131921'
        }),
        menu: (base) => ({
          ...base,
          boxShadow: 'none',
          borderRadius: '0px',
          border: '1px solid #ccc',
          backgroundColor: '#fff'
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected ? '#e0e0e0' : '#fff',
          color: state.isSelected ? '#131921' : '#333',
          margin: '5px 0px',
          cursor: 'pointer',
          ':hover': {
            backgroundColor: '#e0e0e0',
            color: '#131921'
          }
        }),
        singleValue: (base) => ({
          ...base,
          color: '#131921'
        })
      }}
    />
  );
};

export default DropdownCategory;
