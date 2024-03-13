import React, {useEffect, useState} from 'react';
import Header from "../home/Header/Header";
import Footer from "./Footer/Footer";
import {useDispatch, useSelector} from "react-redux";
import {getAdvertisementStart, getCarouselStart} from "../../redux/reducers/AdvertisementSlice";
import {Carousel} from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import carSearch from "./UserFilter/carSearch.png";
import {Link, useNavigate} from "react-router-dom";
import {getCarStart} from "../../redux/reducers/AdminCarSlice";
import {getCarPart} from "../../redux/reducers/AdminCartPartSlice";
import {getBrands} from "../../redux/reducers/AdminBrandSlice";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {getProducts} from "../../redux/reducers/AdminProductSlice";
import {BiSearch} from "react-icons/bi";
import {baseUrl} from "../constants";
import {SelectItem, Select} from "@nextui-org/react";

function Home(props) {
    const dispatch = useDispatch()
    const {carousel} = useSelector(state => state.advertisement)
    useEffect(() => {
        dispatch(getAdvertisementStart())
        dispatch(getCarouselStart())
        dispatch(getProducts())
    }, [])

    const navigate = useNavigate();
    const [carId, setCarId] = useState('');
    const [carPartId, setCarPartId] = useState('');
    const [brandId, setBrandId] = useState("");
    const [showAllCarParts, setShowAllCarParts] = useState(false);
    const [carPartsArrayLength12, setCarPartsArrayLength12] = useState([]);
    const {products, isLoading} = useSelector(state => state.adminProduct);

    const {cars} = useSelector(state => state.adminCar);
    const {brands} = useSelector(state => state.adminBrand);
    const {carParts} = useSelector(state => state.adminCarPart);

    useEffect(() => {
        dispatch(getCarStart());
        dispatch(getCarPart());
        dispatch(getBrands());
    }, []);
    const [error, setError] = useState(false)

    function searchAndNavigate() {
        let url = '/search'
        if (brandId === "" && carId === "" && carPartId === "") {
            setError(true)
            return;
        }
        url += (brandId === "" ? '/brand' : ('/' + brandId));
        url += (carId === "" ? '/car' : ('/' + carId));
        url += (carPartId === "" ? '/carPart' : ('/' + carPartId));
        navigate(url)
    }

    const showAllCarElements = () => {
        if (showAllCarParts) {
            return carParts
        } else {
            return carParts.slice(0, 12)
        }
    }
    return (
        <div className={"overflow-x-scroll h-full"}>
            <Header/>
            <div className={"container max-w-[1260px]"}>
                <div
                    className={'flex sm:flex-row flex-col justify-between sm:px-[50px]  mt-[43px] mb-[9px] pb-[43px] border-b-1 max-h-[422px]'}>
                    <div className={'max-w-[440px] border-t-2 border-blue-500'}>
                        <div className={'p-3'} style={{backgroundColor: '#fafafa'}}>
                            <div className={'d-flex align-items-center justify-content-evenly gap-2'}>
                                <img width={60} src={carSearch} alt={'..'}/>
                                <p className={"sm:text-lg text-sm"}>QISMLARNI IZLASH UCHUN MOSHINANI TANLANG</p>
                            </div>
                            <div className={'my-2'}>
                                <div className="input-group mb-3">
                                    <span className="input-group-text bg-primary text-white">1</span>
                                    <Select
                                        radius={'none'}
                                        variant={'faded'}
                                        className={` w-[calc(100%-36px)]  h-10 ${brandId === "" && error ? "is-invalid" : ""}`}
                                        id={'brand'}
                                        label={'Brand tanlang'}
                                        value={brandId}
                                        onChange={(e) => setBrandId(e.target.value)}
                                    >

                                        {brands?.map((item) => (
                                            <SelectItem className={" bg-gray-200"} key={item.id} value={item.id}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    {brandId === "" && error &&
                                        <div className="invalid-feedback">Please select a brand.</div>}
                                </div>

                                <div className="input-group mb-3">
                                    <span className="input-group-text bg-primary text-white">2</span>
                                    <Select
                                        radius={'none'}
                                        variant={'faded'}
                                        label={"Mashina tanlang"}
                                        id={'car'}
                                        className={`w-[calc(100%-36px)]  ${carId === "" && error ? "is-invalid" : ""}`}
                                        value={carId}
                                        onChange={(e) => setCarId(e.target.value)}
                                    >
                                        {cars?.filter(car => car.brand.id === brandId).map((item) => (
                                            <SelectItem key={item.id} value={item.id}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    {carId === "" && error &&
                                        <div className="invalid-feedback">Please select a car.</div>}
                                </div>

                                <div className="input-group mb-3">
                                    <span className="input-group-text bg-primary text-white">3</span>
                                    <Select
                                        radius={'none'}
                                        variant={'faded'}
                                        label={"Ehtiyot qism tanlang"}
                                        className={`w-[calc(100%-36px)]`}
                                        value={carPartId}
                                        onChange={(e) => setCarPartId(e.target.value)}
                                    >
                                        {carParts?.map((item) => (
                                            <SelectItem key={item.id} value={item.id}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>

                            <button
                                onClick={searchAndNavigate}
                                className={'btn btn-primary w-100 d-flex align-items-center justify-content-center'}>
                                <BiSearch fontSize={25}/>
                                Qidirsh
                            </button>
                        </div>
                    </div>
                    <div className={' '}>
                        <div className={" sm:max-w-[660px] max-w-full"}>
                            {
                                carousel?.length > 0 &&
                                <Carousel infiniteLoop={true} showThumbs={false} autoPlay
                                          className={"sm:max-w-[660px] max-w-full max-h-[350px]"}>
                                    {
                                        carousel?.map(item =>
                                            <div key={item.id}>
                                                <LazyLoadImage
                                                    className={"max-h-[348px] max-w-[660px]"}
                                                    src={baseUrl === "" ? "http://localhost:8080" : baseUrl + `/api/v1/file/getFile/${item.attachment.id}`}
                                                    alt="Image"
                                                />
                                            </div>
                                        )
                                    }
                                </Carousel>
                            }

                        </div>
                    </div>
                </div>
                <div className={"pb-10 pt-[10px] text-center"}>
                    <h3>
                        Ehtiyot qismlar
                    </h3>
                    {
                        isLoading ? (
                            "Loading..."
                        ) : (
                            <div className="grid grid-rows-2 grid-cols-6 mb-4">
                                {showAllCarElements()?.map((item, index) => {
                                    return <ul key={item.id}
                                               className=" border-b pt-[10px] gap-2 ">
                                        <li
                                            className="max-w-[207px] mb-2 flex items-center flex-col  min-h-[160px]">
                                            <Link to={'/search/brand/car/' + item.id}>
                                                <LazyLoadImage
                                                    height={130}
                                                    width={130}
                                                    className={"text-center aspect-square object-contain"}
                                                    effect="blur"
                                                    src={baseUrl === "" ? "http://localhost:8080" : baseUrl + `/api/v1/file/getFile/${item.photo.id}`}
                                                />
                                                <p className="text-center">{item.name}</p>
                                            </Link>
                                        </li>
                                    </ul>
                                })}
                            </div>
                        )
                    }
                    <div onClick={() => setShowAllCarParts(prev => !prev)} className={"w-[300px]  mt-3 mx-auto"}>
                        <span
                            className={"text-center cursor-pointer  py-3 px-5  bg-gray-200 mx-auto  text-sm hover:no-underline underline"}>
                            {
                                showAllCarParts ? "Yopish" : " Barcha ehtiyot qismlar"
                            }
                        </span>
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
    );
}

export default Home;