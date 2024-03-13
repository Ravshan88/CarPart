// SearchResults.js
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import Header from "../Header/Header";
import {
    getProducts,
} from "../../../redux/reducers/AdminProductSlice";
import {useDispatch, useSelector} from "react-redux";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {Divider} from "antd";
import carSearch from './carSearch.png'
import {getCarStart} from "../../../redux/reducers/AdminCarSlice";
import {getCarPart} from "../../../redux/reducers/AdminCartPartSlice";
import {getBrands} from "../../../redux/reducers/AdminBrandSlice";
import {SlBasket} from "react-icons/sl";
import {toast, ToastContainer} from "react-toastify";
import {BiSearch} from "react-icons/bi";
import {baseUrl} from "../../constants";
import {Select, SelectItem} from "@nextui-org/react";


function SearchResults(props) {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const currentBrandId = useParams().brandId
    let currentCarId = useParams().carId
    const currentCarPartId = useParams().carPartId;
    const {products,} = useSelector(state => state.adminProduct)
    const {cars} = useSelector(state => state.adminCar);
    const {brands} = useSelector(state => state.adminBrand);
    const {carParts} = useSelector(state => state.adminCarPart);
    const [carId, setCarId] = useState('');
    const [carPartId, setCarPartId] = useState('');
    const [brandId, setBrandId] = useState("");

    const [basket, setBasket] = useState([])

    const location = useLocation()

    useEffect(() => {
        currentBrandId !== 'brand' ? setBrandId(currentBrandId) : setBrandId('')
        currentCarId !== 'car' ? setCarId(currentCarId) : setCarId('')
        currentCarPartId !== 'carPart' ? setCarPartId(currentCarPartId) : setCarPartId('')
        dispatch(getProducts())
        dispatch(getCarStart());
        dispatch(getCarPart());
        dispatch(getBrands());
    }, [dispatch, location.pathname])
    useEffect(() => {

        dispatch(getProducts())
        dispatch(getCarStart());
        dispatch(getCarPart());
        dispatch(getBrands());

        let bas = JSON.parse(localStorage.getItem('basket'))
        if (bas == null) {
            localStorage.setItem('basket', JSON.stringify([]))
        } else {
            setBasket(bas)
        }

    }, [])
    const [error, setError] = useState(false)

    function searchAndNavigate() {
        let url = '/search'
        url += (brandId === "" ? '/brand' : ('/' + brandId));
        url += (carId === "" ? '/car' : ('/' + carId));
        url += (carPartId === "" ? '/carPart' : ('/' + carPartId));
        navigate(url)
    }

    function addToBasket(item) {
        if (basket && basket?.filter(i => i.id === item.id).length !== 0) {
            return;
        }
        basket.push({...item, amount: 1})
        setBasket([...basket])
        localStorage.setItem("basket", JSON.stringify(basket))
        toast.success(item.name + " savatga qo`shildi")
    }

    function deleteFromBasket(id) {
        let arr = basket.filter(item => item.id !== id);
        setBasket(arr)
        localStorage.setItem("basket", JSON.stringify(arr))
    }

    function addToBasketAndNavigate(item) {
        addToBasket(item)
        navigate('/basket')
    }

    function openInfoProduct(item) {
        navigate('/infoproduct/' + item.id)
    }

    return (
        <div>
            <ToastContainer/>
            <Header/>
            <div className={'container d-flex gap-2 my-2'}>
                <div className={"bg-gray-100 mt-3 shadow p-2 sticky top-0 max-w-[300px] max-h-[330px]  rounded"}>
                    <div className={'d-flex align-items-center  justify-content-evenly gap-2'}>
                        <img width={60} src={carSearch} alt={'..'}/>
                        <p>QISMLARNI IZLASH UCHUN MOSHINANI TANLANG</p>
                    </div>
                    <div className={'my-2'}>
                        <div className="input-group mb-3">
                            <span className="input-group-text bg-primary text-white">1</span>
                            <Select
                                radius={'none'}
                                variant={'faded'}
                                label={"Brand tanlang"}
                                className={`w-[calc(100%-36px)]`}
                                id={'brand'}
                                value={brandId}
                                onChange={(e) => {
                                    setBrandId(e.target.value)
                                    setCarId('')
                                }}
                            >
                                {brands?.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </Select>

                        </div>

                        <div className="input-group mb-3">
                            <span className="input-group-text bg-primary text-white">2</span>
                            <Select
                                radius={'none'}
                                variant={'faded'}
                                label={"Mashina tanlang"}
                                id={'car'}
                                className={`w-[calc(100%-36px)]`}
                                value={carId}
                                onChange={(e) => setCarId(e.target.value)}
                            >
                                {cars?.filter(car => car?.brand?.id === (brandId))?.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </Select>

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
                <div className={"flex flex-wrap w-full h-full overflow-y-scroll"}>
                    {products?.content?.filter(product => (currentBrandId !== "brand" ? product?.car?.brand?.id === currentBrandId : true) && (currentCarId !== "car" ? product?.car?.id === currentCarId : true) && (currentCarPartId !== "carPart" ? product?.carPart?.id === currentCarPartId : true))
                        .map((item, i) =>
                            <div className={'rounded m-3 shadow-xl '} key={i}>
                                <div key={i}
                                     className="bg-gray-100 h-full cursor-pointer hover:scale-[1.02] transition duration-75 rounded ">
                                    <div>
                                        <div onClick={() => {
                                            navigate("/infoproduct/" + item?.id)
                                        }}>
                                            <div className={"rounded shadow p-1 text-center"}>
                                                <LazyLoadImage
                                                    effect="blur"
                                                    className="w-full h-full block text-center"
                                                    width={200}
                                                    height={200}
                                                    src={baseUrl === "" ? "http://localhost:8080" : baseUrl + `/api/v1/file/getFile/${item?.photo?.id}`}
                                                    alt="Product Image"
                                                />
                                            </div>
                                            <div className={"px-3"}>
                                                <div className="mt-4 w-[200px]">
                                                    <div className="flex items-center mb-2">
                                                        <h1 className="text-gray-500 hover:text-orange-500 hover:underline hover:scale-95 tracking-widest text-lg">{item.name}</h1>
                                                    </div>
                                                    <div className="flex items-center mb-2">
                                                        <h1 className="text-orange-500 tracking-widest ">{item.price.toLocaleString()} so`m</h1>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <Divider className={"m-2 mx-auto"}/>
                                        <div className={"flex gap-2 justify-center align-items-center p-2"}>
                                            <button
                                                className={"hover:bg-orange-600 transition duration-75 ease-in-out text-white bg-orange-500 font-thin w-75 rounded p-2"}
                                                onClick={() => addToBasketAndNavigate(item)}>Sotib olish
                                            </button>
                                            <div
                                                className={"cursor-pointer hover:bg-gray-200 border-2 border-gray-500 rounded p-1"}
                                                onClick={() => addToBasket(item)}>
                                                <SlBasket
                                                    className={`text-[28px] ${basket.filter(i => i.id === item.id).length !== 0 ? 'text-gray-500' : 'text-orange-500'}`}/>


                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        )
                    }
                </div>
            </div>

        </div>
    );
}

export default SearchResults;
