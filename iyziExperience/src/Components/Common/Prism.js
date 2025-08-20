import React, {useEffect, useRef} from "react";
import Prism from "prismjs";
import "prismjs/components/prism-json"; // JSON dil desteğini ekleyin
import "prismjs/themes/prism.css"; // Prism.js CSS'ini import edin

const PrismCode = (props) => {
    const ref = useRef();

    useEffect(() => {
        if (ref.current) {
            Prism.highlightElement(ref.current);
        }
    }, [props.code]); // code prop'u değiştiğinde yeniden vurgulama yapın

    const {code, language} = props;
    return (
        <pre className="line-numbers">
            <code ref={ref} className={`language-${language}`}>
                {code.trim()}
            </code>
        </pre>
    );
};

export default PrismCode;