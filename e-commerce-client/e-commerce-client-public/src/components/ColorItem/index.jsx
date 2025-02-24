const ColorItem = ({ handleClick = () => {}, active, color }) => {
  return (
    <span
      onClick={handleClick}
      className={` inline-block w-5 h-5 rounded-full cursor-pointer transition-all border-2 `}
      style={{
        backgroundColor: `${color}`,
        boxShadow: `${active === color ? '0 0 0 2px #3b4149' : 'none'}`
      }}
    ></span>
  );
};

export default ColorItem;
