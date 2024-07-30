import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineSetting } from 'react-icons/ai';
import { FiMaximize, FiSettings } from 'react-icons/fi';
import { ISettings } from '../Playground';
import Select from 'react-select';

type PreferenceNavProps = {
    settings: ISettings,
	setSettings: React.Dispatch<React.SetStateAction<ISettings>>;
    setFontSize: React.Dispatch<React.SetStateAction<string>>;           
};

const PreferenceNav:React.FC<PreferenceNavProps> = ({settings, setSettings, setFontSize}) => {

	const [isFullScreen, setIsFullScreen] = useState(false);

	const handleFullScreen = () => {
		if(isFullScreen){
			document.exitFullscreen();
			setIsFullScreen(false);
		}
		else{
			document.documentElement.requestFullscreen();
			setIsFullScreen(true);
		}
	}
	const [showSettings, setShowSettings] = useState(false);

	const handleFontSizeChange = (selectedOption: any) => {
        setSettings({ ...settings, fontSize: selectedOption.value });
        setFontSize(selectedOption.value)
    }

	useEffect(()=> {

		function exitHandler(e: any){
			if(!document.fullscreenElement){
				setIsFullScreen(false);
				return;
			}

			setIsFullScreen(true);
		}

		if(document.addEventListener){
			document.addEventListener("fullscreenchange", exitHandler);
			document.addEventListener("webkitfullscreenchange", exitHandler);
			document.addEventListener("mozfullscreenchange", exitHandler);
			document.addEventListener("MSFullscreenChange", exitHandler);
		}

	}, [isFullScreen])
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setSettings({ ...settings, settingsModalIsOpen: false });
            }
        };

        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSettings({ ...settings, settingsModalIsOpen: false });
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [settings, setSettings]);

	const fontSizeOptions = [
        { value: '14px', label: '14px' },
        { value: '15px', label: '15px' },
        { value: '16px', label: '16px' },
        { value: '18px', label: '18px' },
        { value: '32px', label: '32px' }
    ];

    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            backgroundColor: '#1E1E1E',
            color: '#fff',
            borderColor: '#2D2D2D',
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: '#fff',
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: '#1E1E1E',
            color: '#fff',
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#333' : '#1E1E1E',
            color: state.isSelected ? '#fff' : '#fff',
            '&:hover': {
                backgroundColor: '#333',
            },
        }),
    };

    
    return (
        <>
            <div className='flex items-center justify-between bg-dark-layer-2 h-11 w-full'>
			<div className='flex items-center text-white'>
				<button className='flex cursor-pointer items-center rounded focus:outline-none bg-dark-fill-3 text-dark-label-2 hover:bg-dark-fill-2  px-2 py-1.5 font-medium'>
					<div className='flex items-center px-1'>
						<div className='text-xs text-label-2 dark:text-dark-label-2'>JavaScript</div>
					</div>
				</button>
			</div>

			<div className='flex items-center m-2'>
				<button className='preferenceBtn group' onClick={() => setSettings({...settings, settingsModalIsOpen: true})} >
					<div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
						<AiOutlineSetting />
					</div>
					<div className='preferenceBtn-tooltip'>Settings</div>
				</button>

				<button className='preferenceBtn group' onClick={handleFullScreen}>
					<div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
						{isFullScreen ? <AiOutlineFullscreenExit />: <AiOutlineFullscreen />}
					
					</div>
					<div className='preferenceBtn-tooltip'>Full Screen</div>
				</button>
			</div>
		</div>
		{settings.settingsModalIsOpen && (
                <div className='fixed inset-0 bg-dark-layer-2 bg-opacity-50 flex justify-center items-center z-50'>
                    <div className='bg-dark-layer-1 p-6 rounded shadow-md z-50'>
                        <h2 className='text-white font-semibold mb-4'>Settings</h2>
                        <label className='block mb-2 text-white'>Choose your preferred font size for the code editor:</label>
                        <Select
                            value={fontSizeOptions.find(option => option.value === settings.fontSize)}
                            onChange={handleFontSizeChange}
                            options={fontSizeOptions}
                            styles={customStyles}
                            className='text-white'
                        />
                        <button
                            onClick={() => setSettings({ ...settings, settingsModalIsOpen: false })}
                            className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    
    );
}
export default PreferenceNav;