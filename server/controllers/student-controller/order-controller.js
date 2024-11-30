const paypal = require("../../helpers/paypal")
const Order = require("../../models/Order")
const StudentCourses = require("../../models/StudentCourses")
const Course = require("../../models/Course")

const createOrder = async (req, res) => {

    try {

        const { userId, userName, userEmail, orderStatus, paymentMethod, paymentStatus, orderDate, paymentId, payerId, instructorId, instructorName, courseImage, courseTitle, coursePricing, courseId } = req.body

        const create_payment_json = {
            intent: "sale",
            payer: {
                payment_method: "paypal"
            },
            redirect_urls: {
                return_url: `${process.env.CLIENT_URL}/payment-return`,
                cancel_url: `${process.env.CLIENT_URL}/payment-cancel`
            },
            transactions: [
                {
                    item_list: {
                        items: [
                            {
                                name: courseTitle,
                                sku: courseId,
                                price: coursePricing,
                                currency: "USD",
                                quantity: 1
                            }
                        ]
                    },
                    amount: {
                        currency: "USD",
                        total: coursePricing.toFixed(2)
                    },
                    description: courseTitle
                }
            ]
        }

        paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
            if (error) {
                console.log(error.response.details)
                return res.status(500).json({
                    success: false,
                    message: "Error while creating paypal payment"
                })
            } else {
                const newlyCreatedCourseOrder = new Order({ userId, userName, userEmail, orderStatus, paymentMethod, paymentStatus, orderDate, paymentId, payerId, instructorId, instructorName, courseImage, courseTitle, coursePricing, courseId })

                await newlyCreatedCourseOrder.save()

                const approvalUrl = paymentInfo.links.find(link => link.rel == "approval_url").href

                res.status(201).json({
                    success: true,
                    data: {
                        approvalUrl,
                        orderId: newlyCreatedCourseOrder?._id
                    }
                })
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Some error occured"
        })
    }

}

const capturePaymentAndFinalizeOrder = async (req, res) => {

    try {

        const { paymentId, payerId, orderId } = req.body;

        let order = await Order.findById(orderId)

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order cannot be found"
            })
        }

        order.paymentStatus = "paid"
        order.orderStatus = "confirmed"
        order.paymentId = paymentId
        order.payerId = payerId

        await order.save()

        const studentCourses = await StudentCourses.findOne({ userId: order?.userId })

        if (studentCourses) {

            studentCourses.courses.push({
                courseId: order?.courseId,
                title: order?.courseTitle,
                instructorId: order?.instructorId,
                instructorName: order?.instructorName,
                dateOfPurchase: order?.orderDate,
                courseImage: order?.courseImage
            })

            await studentCourses.save()

        } else {
            const newStudentCourses = new StudentCourses({
                userId: order.userId,
                courses: [
                    {
                        courseId: order?.courseId,
                        title: order?.courseTitle,
                        instructorId: order?.instructorId,
                        instructorName: order?.instructorName,
                        dateOfPurchase: order?.orderDate,
                        courseImage: order?.courseImage
                    }
                ]
            })

            await newStudentCourses.save()
        }

        await Course.findByIdAndUpdate(order.courseId, {
            $addToSet: {
                students: {
                    studentId: order.userId,
                    studentName: order.userName,
                    studentEmail: order.userEmail,
                    paidAmount: order.coursePricing,
                }
            }
            /* $addToSet: This is a MongoDB operator. It ensures that the value being added to the students array is unique, meaning the same student won't be added twice. If the studentId already exists in the array, it won't add the new object. */
        })

        res.status(200).json({
            success: true,
            message: "Order confirmed",
            data: order
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Some error occured"
        })
    }

}

module.exports = { createOrder, capturePaymentAndFinalizeOrder }