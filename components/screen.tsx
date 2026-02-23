import Image from "next/image";
import { Button } from "./button";
import { currencyFormat } from "@/utils";
import classNames from "classnames";

type ScreenState = 'INIT' | 'EARNED';

type ScreenProps = {
    state: ScreenState;
    earned?: number;
    handleClick: () => void;
};

export const Screen = ({ state, earned = 0, handleClick }: ScreenProps) => {
    const isInit = state === 'INIT';
    const buttonText = isInit ? 'Start' : 'Try again';
    const headingText = isInit ? 'Who wants to be a millionaire?' : currencyFormat(earned);

    const containerClasses = classNames(
        "min-h-screen min-w-screen relative",
        { "bg-theme-base-1": !isInit, "bg-theme-orange-1/20": isInit }
    );

    return (
        <div className={containerClasses}>
            {isInit && <div className="absolute top-0 left-0 w-screen h-screen bg-theme-base-0 clip-diagonal z-0" />}

            <div className="relative z-10 container mx-auto h-full flex justify-center items-center">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-28 w-full md:w-auto h-full md:h-auto justify-center relative">
                    
                    <div className="w-49 md:w-auto">
                        <Image src="/og-image.png" width={451} height={356} alt="Logo" />
                    </div>

                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        {state === 'EARNED' && (
                            <span className="opacity-50 font-semibold text-[18px] md:text-[32px]">Total score:</span>
                        )}

                        <h1 className="font-semibold text-[32px] lg:text-[56px] max-w-125 pb-16">
                            {headingText}
                        </h1>

                        {/* Desktop button */}
                        <div className="hidden md:block w-74">
                            <Button onClick={handleClick}>{buttonText}</Button>
                        </div>
                    </div>

                    {/* Mobile button */}
                    <div className="md:hidden absolute bottom-12 left-4 right-4">
                        <Button onClick={handleClick} className="w-full">
                            {buttonText}
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};
