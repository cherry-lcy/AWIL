import {useState, useEffect} from 'react';
import {getThemesAPI, getSubthemesAPI, getCategoriesAPI} from '../apis/option.js';

function useOptions(){
    const [optionList, setOptionList] = useState({
        themesList: [],
        subthemesList: [],
        categoriesList: []
    });

    useEffect(()=>{
        const getOptionList = async ()=>{
            const themes = await getThemesAPI();
            const subthemes = await getSubthemesAPI();
            const categories = await getCategoriesAPI();

            setOptionList({
                themesList: themes.data,
                subthemesList: subthemes.data,
                categoriesList: categories.data
            })
        }

        getOptionList()
    }, [])

    return {optionList};
}

export {useOptions};