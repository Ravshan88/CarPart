import React, {useEffect, useState} from 'react';
import PageTitle from "../PageTitle";
import {toast, ToastContainer} from "react-toastify";
import {
    changeIsEdit,
    getCarStart,
    setBase64, setEditingId,
    setImageFileForBackend, setObjForBrand,
    setPhotoIdForEdit,
    deleteCar
} from "../../../redux/reducers/AdminCarSlice";
import {useDispatch, useSelector} from "react-redux";
import {Table, TableBody, TableCell, TableContainer, TableHeader, TableRow} from "@windmill/react-ui";
import {Button} from "antd";
import {Modal} from "react-bootstrap";
import {LazyLoadImage} from "react-lazy-load-image-component";
import uploadImg from "../../images/upload.png";
import {Delete} from "@mui/icons-material";
import ImgModal from "../ImgModal";

import {getBrands} from "../../../redux/reducers/AdminBrandSlice";
import {Tooltip} from "@nextui-org/react";
import {EyeIcon} from "../EyeIcon";
import {DeleteIcon} from "../DeleteIcon";
import {EditIcon} from "../EditIcon";
import {baseUrl} from "../../constants";

function AdminCar(props) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isImgModalOpen, setIsImgModalOpen] = useState(false)
    const [carPartInfo, setCarPartInfo] = useState({})
    const {
        imgFileForBackend,
        photoIdForEdit,
        editingId,
        isEditing,
        cars,
        base64
    } = useSelector(state => state.adminCar)
    const {brands} = useSelector(state => state.adminBrand)

    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [brandId, setBrandId] = useState('');

    useEffect(() => {
        dispatch(getCarStart())
        dispatch(getBrands())
    }, [dispatch])
    useEffect(() => {
        dispatch(getCarStart())
        dispatch(getBrands())
    }, [])

    function handleOpenModal() {
        setIsModalOpen(true)
        dispatch(changeIsEdit(false))
    }

    function handleOpenImgModal() {
        setIsImgModalOpen(p => !p)
    }

    function handleCloseModal() {
        setIsModalOpen(false)
        dispatch(setBase64(""))
        setName("")
        setBrandId('')
        dispatch(setImageFileForBackend(""))
        dispatch(setPhotoIdForEdit(""))
    }

    function handleFile(e) {
        let file = e.target.files[0];
        dispatch(setImageFileForBackend(e.target.files[0]))
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                // setAttachmentId("")
                dispatch(setBase64(reader.result))
            };
            reader.readAsDataURL(file);
        }
    }

    function handleAddCarPart() {
        if (brandId === '') {
            toast.error("Iltimos Brendni tanlang!");
        } else if (name === "") {
            toast.error("Iltimos Avtomobil nomini kiriting");
        } else if ((imgFileForBackend === null || imgFileForBackend === "") && !photoIdForEdit) {
            toast.error("Iltimos Avtomobil rasmini yuklang");
        } else {
            dispatch(setObjForBrand({
                name,
                photo: imgFileForBackend,
                brandId: brandId,
                photoId: photoIdForEdit,
                id: editingId,
                isEditing
            }));
            handleCloseModal()
        }
    }


    function editCarPart(item) {
        dispatch(changeIsEdit(true))
        setIsModalOpen(true)
        dispatch(setEditingId(item.id))
        setName(item.name)
        setBrandId(item.brand.id)
        dispatch(setPhotoIdForEdit(item.photo.id))
    }


    const [askDelete, setAskDelete] = useState(false)
    const [deletedItem, setDeletedItem] = useState('')

    function deletedCar(item) {
        setAskDelete(true)
        setDeletedItem(item)
    }

    function reallyDelete() {

        dispatch(deleteCar({
            id: deletedItem.id,
            attachmentId: deletedItem.photo.id,
            attachmentName: deletedItem.photo.name
        }))
        closeAskModal()
    }

    function closeAskModal() {
        setAskDelete(false)
        setDeletedItem('')
    }

    return (
        <div className={` h-screen  bg-gray-900 `}>
            <ToastContainer/>
            <ImgModal infoData={carPartInfo} isImgModalOpen={isImgModalOpen}
                      handleCloseImgModal={handleOpenImgModal}/>
            <div className={"flex flex-col justify-between my-2"}>
                <div className={"flex justify-between"}>
                    <PageTitle>
                        Avtomobil
                    </PageTitle>

                    <div>
                        <button className={"border-none small text-white p-1 rounded bg-fuchsia-700"}
                                onClick={handleOpenModal}>
                            Yangi avtomobil qo'shish
                        </button>
                    </div>
                </div>

                <div className={"mt-2"}>
                    <TableContainer className="mb-8">
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableCell>Photo</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Brend</TableCell>
                                    <TableCell>Action</TableCell>
                                </tr>
                            </TableHeader>
                            <TableBody>
                                {cars?.map((item, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <div
                                                className="flex items-center text-sm cursor-pointer">
                                                <LazyLoadImage effect={"blur"} className={"rounded-3xl"}
                                                               width={50} height={50}
                                                               src={baseUrl === "" ? "http://localhost:8080" : baseUrl + `/api/v1/file/getFile/${item?.photo?.id}`}
                                                               alt="User avatar"/>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-semibold">{item.name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-semibold">{item.brand?.name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="relative flex items-center gap-2">
                                                <Tooltip content="Details">
                                                  <span onClick={() => {
                                                      setCarPartInfo(item)
                                                      handleOpenImgModal()
                                                  }}
                                                        className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                    <EyeIcon/>
                                                  </span>
                                                </Tooltip>
                                                <Tooltip content="Edit user">
                                                  <span onClick={() => editCarPart(item)}
                                                        className=" text-lg text-default-400 cursor-pointer active:opacity-50">
                                                    <EditIcon/>
                                                  </span>
                                                </Tooltip>
                                                <Tooltip color="danger" content="Delete user">
                                                  <span onClick={() => deletedCar(item)}
                                                        className="text-lg text-danger cursor-pointer active:opacity-50">
                                                    <DeleteIcon/>
                                                  </span>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                    </TableContainer>
                </div>
            </div>


            <div className={'umodal'}>
                <Modal show={askDelete} onHide={closeAskModal}>
                    <Modal.Header closeButton>
                        <div className={'d-flex justify-content-around '}>
                            <LazyLoadImage effect={"blur"} className={"rounded-3xl"}
                                           width={50} height={50}
                                           src={baseUrl === "" ? "http://localhost:8080" : baseUrl + `/api/v1/file/getFile/${deletedItem?.photo?.id}`}
                                           alt="User avatar"/>
                            <Modal.Title className={'mx-2'}>{deletedItem.name} </Modal.Title>
                            <p className={'my-2'}>
                                Avtomobilni rostdan ham o'chirilsinmi?
                            </p>
                        </div>

                    </Modal.Header>
                    <Modal.Body>

                        <div className={'d-flex'}>
                            <button
                                onClick={reallyDelete}
                                className="p-1 rounded my-2 w-full text-white text-center bg-blue-400">
                                Ha
                            </button>
                            <button
                                onClick={closeAskModal}
                                className="p-1 rounded my-2 mx-2 w-full text-white text-center bg-red-400">
                                Yo'q
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>


            <div className={'umodal'}>
                <Modal show={isModalOpen} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Yangi Avtomobil qo'shish</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label>Avtomobil nomi:</label>
                        <input
                            className={`form-control`}
                            type={'text'}
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder={""}
                        />

                        <label className={'mt-3'}>Brend:</label>
                        {brands?.length === 0 ? <h3>Iltimos oldin Brend qo'shing</h3> :
                            <select
                                className={'form-select'}
                                value={brandId}
                                onChange={(e) => setBrandId(e.target.value)}
                            >
                                <option value={''}>Brendni tanlang</option>
                                {brands?.map((item, index) => (
                                    <option key={item.id} value={item.id}>

                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        }
                        <div className={"my-3 flex justify-center position-relative"}>
                            <label>
                                <input
                                    className={"form-control "}
                                    type={'file'}
                                    hidden
                                    onChange={handleFile}
                                />
                                <div
                                    className={`border w-[80px] h-[80px] rounded-[50%] p-1 hover:scale-[1.1] transition-[1s] flex justify-center mx-auto`}>
                                    {
                                        base64 ?
                                            <LazyLoadImage style={{borderRadius: "50%"}} height={80} width={80}
                                                           src={base64}
                                                           alt=""/>
                                            :
                                            isEditing ?
                                                <LazyLoadImage style={{borderRadius: "50%"}} height={80} width={80}
                                                               src={baseUrl === "" ? "http://localhost:8080" : baseUrl + `/api/v1/file/getFile/${photoIdForEdit}`}
                                                               alt=""/> :
                                                <LazyLoadImage style={{borderRadius: "50%"}} height={80} width={80}
                                                               src={uploadImg} alt=""/>
                                    }
                                </div>
                            </label>
                            <div className={"deleteFileButton "}>
                                {
                                    base64 &&
                                    (<Button title={"Delete"} type={"dashed"} shape={"circle"}
                                             icon={<Delete color={"error"}/>} onClick={() => dispatch(setBase64(""))}
                                             className={"flex justify-center"}/>)
                                }
                            </div>

                        </div>
                        <button
                            onClick={handleAddCarPart}
                            className="p-1 rounded my-2 w-full text-white text-center bg-blue-400">
                            {
                                isEditing ? "Tahrirlash" : "Saqlash"
                            }
                        </button>

                    </Modal.Body>
                </Modal>
            </div>

        </div>
    );
}

export default AdminCar;