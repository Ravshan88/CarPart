import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {
    Table,
    TableHeader,
    TableCell,
    TableBody,
    TableRow,
    TableContainer,
} from "@windmill/react-ui";
import {
    addAdmin,
    getAdminData, setIsEditing,
} from "../../../redux/reducers/AdminAdminSlice";
import {ToastContainer, toast} from "react-toastify";
import PageTitle from "../PageTitle";
import {Modal} from 'react-bootstrap';
import {Tooltip} from "@nextui-org/react";
import {EyeIcon} from "../EyeIcon";
import {EditIcon} from "../EditIcon";
import {DeleteIcon} from "../DeleteIcon";
import {Controller, useForm} from "react-hook-form";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import PhoneInput from "react-phone-number-input";
import {CgSpinner} from "react-icons/cg";

function AdminAdmins() {
    const dispatch = useDispatch();
    const {admins, isLoading, isEditing} = useSelector((state) => state.adminAdmins);
    const [showPassword, setShowPassword] = useState(false);
    const {
        handleSubmit,
        control,
        reset,
        formState: {errors}
    } = useForm();
    useEffect(() => {
        dispatch(getAdminData())
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAdminData())

    }, []);
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleAddAdmin = (formData) => {
        if (formData.phone.startsWith("+998")) {
            if (formData.phone.length === 13) {
                if (isEditing) {
                    if (formData.password.length >= 8) {
                        dispatch(addAdmin({formData, isEditing}));
                        closeModal()
                    } else {
                        toast.error(
                            "Parol 8 ta belgidan iborat bo`lishi zarur"
                        );
                    }
                } else {
                    if (formData.password.length >= 8) {
                        dispatch(addAdmin({formData, isEditing}));
                        closeModal()
                    } else {
                        toast.error(
                            "Parol 8 ta belgidan iborat bo`lishi zarur"
                        );
                    }
                }
            } else {
                toast.error("Telefon raqam +998 XX XXX-XX-XX ko`rinishda bo`lishi zarur");
            }
        } else {
            toast.error("Iltimos O`zbekiston telefon raqamini kiriting");
        }
    };
    const handleDeleteAdmin = (adminId) => {
        dispatch({type: "adminAdmins/deleteAdmin", payload: adminId});
    };

    const [isModalOpen, setIsModalOpen] = useState(false)

    function openModal() {
        setIsModalOpen(true)
    }

    function closeModal() {
        dispatch(setIsEditing(false))
        setIsModalOpen(false)
        reset({name: "", phone: "", password: ""})
    }

    function editData(admin) {
        dispatch(setIsEditing({editing: true, id: admin.id}))
        setIsModalOpen(true)
        reset({
            name: admin.name,
            phone: admin.phone,
            password: ""
        })
    }

    return (
        <div className={`h-screen bg-gray-900 `}>
            <div className={'d-flex justify-content-between my-3'}>
                <PageTitle>
                    Adminlar
                </PageTitle>

                <div>
                    <button onClick={openModal}
                            className={'border-none bg-violet-800 hover:bg-violet-700 text-center py-1 px-3 text-white rounded '}>Yangi
                        admin
                        qo'shish
                    </button>
                </div>
            </div>
            <div>
                <TableContainer className="my-3">
                    {
                        isLoading ? "loading" : (
                            <Table>
                                <TableHeader>
                                    <tr>
                                        <TableCell>FIO</TableCell>
                                        <TableCell>Telefon raqam</TableCell>
                                        <TableCell></TableCell>
                                    </tr>
                                </TableHeader>
                                {admins ? <TableBody>
                                    {admins?.map((admin, i) => (
                                        <TableRow key={i}>

                                            <TableCell>
                                                <span className="text-sm"> {admin.name}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm"> {admin.phone}</span>
                                            </TableCell>

                                            <TableCell>
                                                <div className="relative flex items-center gap-2">
                                                    <Tooltip content="Edit user">
                                                  <span onClick={() => editData(admin)}
                                                        className=" text-lg text-default-400 cursor-pointer active:opacity-50">
                                                    <EditIcon/>
                                                  </span>
                                                    </Tooltip>
                                                    <Tooltip color="danger" content="Delete user">
                                                  <span onClick={() => handleDeleteAdmin(admin.id)}
                                                        className="text-lg text-danger cursor-pointer active:opacity-50">
                                                    <DeleteIcon/>
                                                  </span>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody> : "salom"}

                            </Table>

                        )
                    }

                </TableContainer>
            </div>


            <div className={'umodal'}>
                <Modal show={isModalOpen} onHide={closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title> Admin qo`shish</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(handleAddAdmin)}>
                            <div>
                                <label htmlFor=""
                                       className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                                    Admin Ism Familiyasi</label>
                                <Controller
                                    name='name'
                                    control={control}
                                    defaultValue=""
                                    rules={{required: "Ism Familiya kiriting"}}
                                    render={({field}) => (
                                        <div>
                                            <input
                                                {...field}
                                                id={"name"}
                                                type={'text'}
                                                className='form-control my-1'

                                            />
                                            {errors.name && (
                                                <p className='error-message'>{errors.name.message}!</p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <label htmlFor="phone"
                                       className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                                    Telefon Raqam</label>
                                <Controller
                                    name='phone'
                                    control={control}
                                    defaultValue=""
                                    rules={{required: "Telefon raqam kiriting"}}
                                    render={({field}) => (
                                        <div>
                                            <PhoneInput
                                                id={"phone"}
                                                {...field}
                                                defaultCountry='UZ'
                                                limitMaxLength={true}
                                                placeholder='+998 90 123 45 67'
                                            />
                                            {errors.phone && (
                                                <p className='error-message'>{errors.phone.message}!</p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <label htmlFor="password"
                                       className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Parol</label>
                                <Controller
                                    name='password'
                                    control={control}
                                    defaultValue=''
                                    rules={{required: !isEditing ? "Parol kiting" : false}}
                                    render={({field}) => (
                                        <div className=' d-flex input-group align-items-center'>
                                            <input
                                                {...field}
                                                id={"password"}
                                                placeholder="••••••••"
                                                type={showPassword ? 'text' : 'password'}
                                                className='form-control my-1'

                                            />
                                            <button
                                                className='btn bg-gray-300 border  h-[40px]'
                                                type='button'
                                                onClick={handleTogglePassword}
                                            >
                                                {
                                                    showPassword ? <AiOutlineEye color={"black"}/> :
                                                        <AiOutlineEyeInvisible color={"black"}/>
                                                }
                                            </button>
                                        </div>

                                    )}

                                />
                                {errors.password && (
                                    <p className='error-message'>
                                        {errors.password.message}!
                                    </p>
                                )}
                            </div>
                            <button type="submit"
                                    className="w-full text-white bg-violet-800  hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                {isLoading ? (
                                    <div className={"d-flex justify-center"}>
                                        <CgSpinner className='animate-spin' size={25}/>
                                    </div>
                                ) : (
                                    "Saqlash"
                                )}
                            </button>
                        </form>

                    </Modal.Body>

                </Modal>
            </div>
            <ToastContainer/>
        </div>
    );
}

export default AdminAdmins;
