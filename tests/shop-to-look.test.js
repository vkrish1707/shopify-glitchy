const SkillEditor = ({ value, api, stopEditing }) => {
    const [val, setVal] = useState(value || '');
    const options = ['Java', 'Python', 'Go']; // or props.options

    const handleChange = (e) => {
        setVal(e.target.value);
        stopEditing(); // close editor
    };

    const getValue = () => val;

    return (
        <Select
            value={val}
            onChange={handleChange}
            autoFocus
            fullWidth
            size="small"
        >
            {options.map((opt) => (
                <MenuItem key={opt} value={opt}>
                    {opt}
                </MenuItem>
            ))}
        </Select>
    );
};

SkillEditor.getValue = function () {
    return this.val;
};

export { SkillRenderer, SkillEditor };



const SkillRenderer = ({ value }) => {
    return <span>{value || 'Select'}</span>;
};
