
$(document).ready(function () {

/*MÁSCARAS*/
    $('#ExpirationDate').mask('00/0000');
    $('#SecurityCode').mask('0000');

/*EVENTOS*/
    var url_string = window.location.href;
    var url = new URL(url_string);
    var TicketType = url.searchParams.get("Tipo");

    $("#btn-finalize-payment").on("click", function () {
        /*
        $("#formPayment").validate({
            rules: {
                CardNumber: {
                    required: true,
                    minlength: 16
                },
                Holder: {
                    required: true
                },
                ExpirationDate: {
                    required: true,
				    minlength: 7
                },
                SecurityCode: {
                    required: true,
				    minlength: 3
                }
            },
            messages: {
                CardNumber: {
                    required: "Por favor, informe seu nome CardNumber",
                    minlength: "O nome deve ter pelo menos 16 caracteres"
                },
                Holder: {
                    required: "É necessário informar um email Holder"
                },
                ExpirationDate: {
                    required: "A mensagem não pode ficar em branco ExpirationDate",
                    minlength: "O nome deve ter pelo menos 7 caracteres"
                },
                SecurityCode: {
                    required: "A mensagem não pode ficar em branco SecurityCode"
                }
            }
        });
        */
        
        var PaymentType = "";
        $(".PaymentType:checked").each(function () {
            PaymentType = $(this).val()
        });
        setPaymentOrder(
            $("#Affiliate").val(),
            $("#TicketID").val(),
            TicketType,
            $("#clientName").val(),
            $("#Email").val(),
            PaymentType,
            $("#CardNumber").val(),
            $("#Holder").val(),
            $("#ExpirationDate").val(),
            $("#SecurityCode").val(),
            $("#Installments").val()
        );
        
    });
    $("#CardNumber").on("keyup change blur", function () { });
    $("#Holder").on("keyup change blur", function () { });
    $("#ExpirationDate").on("keyup change blur", function () {
        if ($(this).val().length == 7) {
            validateExpirationDate($(this).val());
        }
    });
    $("#SecurityCode").on("keyup change blur", function () { });
    $("#Installments").on("keyup change blur", function () { });

    
/*FUNÇÕES*/
    /**
     * @param {int32}  _Affiliate
     * @param {string} _TicketID
     * @param {string} _Name
     * @param {string} _Email
     * @param {string} _Type
     * @param {string} _CardNumber
     * @param {string} _Holder
     * @param {string} _ExpirationDate
     * @param {string} _SecurityCode
     * @param {string} _Installments
     */
    function setPaymentOrder(_Affiliate, _TicketID, _TicketType, _Name, _Email, _Type, _CardNumber, _Holder, _ExpirationDate, _SecurityCode, _Installments) {
        $("#btn-finalize-payment").attr('disabled', true);
        var response;
        if (_Affiliate !== '' &&
            _TicketID !== '' &&
            _TicketType !== '' &&
            _Name !== '' &&
            _Email !== '' &&
            _Type !== '' &&
            _CardNumber !== '' &&
            _Holder !== '' &&
            _ExpirationDate !== '' &&
            _SecurityCode !== '' &&
            _Installments !== ''
        ) {
            $(".bg-container-loader").fadeIn();
            let context = {
                
                    Affiliate: _Affiliate,
                    TicketID: _TicketID,
                    TicketType: _TicketType,
                    Customer: {
                        Name: _Name,
                        Email: _Email
                    },
                    Payment: {
                        Type: _Type,
                        Installments: _Installments,
                        Card: {
                            CardNumber: _CardNumber,
                            Holder: _Holder,
                            ExpirationDate: _ExpirationDate,
                            SecurityCode: _SecurityCode
                        }
                    }
            };

            $.ajax({
                type: "POST",
                contentType: 'application/json',
                dataType: "JSON",
                url: "/Home/Payment",
                data: JSON.stringify(context),
                success: function (result) {
                    if (result.status == true) {
                        if (result.context.payment.transaction.detail.IPGApiOrderResponse.TransactionResult === "APPROVED") {
                            response = responsePositive(
                                result.context.payment.transaction.detail.IPGApiOrderResponse.IpgTransactionId,
                                result.context.customer.name,
                                result.context.customer.email,
                                result.context.payment.card.cardNumber,
                                result.context.payment.card.holder,
                                result.context.payment.card.expirationDate,
                                result.context.payment.card.securityCode,
                                result.context.payment.transaction.detail.IPGApiOrderResponse.Brand
                            );
                        } else if (result.context.payment.transaction.detail.IPGApiOrderResponse.TransactionResult === "DECLINED" ||
                            result.context.payment.transaction.detail.IPGApiOrderResponse.TransactionResult === "FRAUD" ||
                            result.context.payment.transaction.detail.IPGApiOrderResponse.TransactionResult === "FAILED") {
                            response = responseNegative(result.context.payment.transaction.detail.IPGApiOrderResponse.IpgTransactionId, result.context.payment.transaction.detail.IPGApiOrderResponse.ErrorMessage);
                        }
                    }
                    else {
                        response = responseError();
                    }
                    $(".bg-container-loader").fadeOut();
                    $(".bg-container-description").addClass("display-out");

                    $(".bg-container-checkout").html(response);
                    $(".container-mg-fx").addClass("justify-content-center");
                }
            });
        } else {
            response = responseError();

            $(".bg-container-description").addClass("display-out");

            $(".bg-container-checkout").html(response);
            $(".container-mg-fx").addClass("justify-content-center");
        } 
    }

    /**
     * 
     * @param {string} _ExpirationDate
     */
    function validateExpirationDate(_ExpirationDate) {
        var currentDate = new Date();
        var date = _ExpirationDate.split("/");
        var month = date[0];
        var year = date[1];

        if (month <= currentDate.getMonth() && year >= currentDate.getFullYear()) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * 
     * @param {int}    _Affiliate
     * @param {string} _TicketID
     * @param {string} _TicketType
     * @param {string} _Name
     * @param {string} _Email
     */
    function getInfoTicket(_Affiliate, _TicketID, _TicketType, _Name, _Email) {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/Home/Information",
            data: {
                OrderRequest: {
                    Affiliate: _Affiliate,
                    TicketID: _TicketID,
                    TicketType: _TicketType,
                    Customer: {
                        Name: _Name,
                        Email: _Email
                    }
                }
            },
            success: function (result) {

                /* Option Installments */
                var options = "";
                for (var i = 1; i <= result.context.ticketInfo.maxOfInstallments; i++) {
                    var amountTotal = (result.context.ticketInfo.amount / i);
                    var prefix = i > 1 ? "s" : "";
                    options += "<option value='" + i + "'>" + i + " x parcela" + prefix + " de R$ " + amountTotal.toFixed(2).toString().replace(".", ",") + "</option>";
                }
                $("#Installments").html(options);

                var itemList = "<li class='list-group-item d-flex justify-content-between'><span>Total (BRL)</span><strong>" + "R$ " + result.context.ticketInfo.amount.toFixed(2).toString() + "</strong></li>";
                $("#Totalizer").append(itemList);
                /**/
            }
        });
    }

    /**
     * RETURN APPROVED
     * @param {any} _IpgTransactionId
     * @param {any} _name
     * @param {any} _email
     * @param {any} _cardNumber
     * @param {any} _holder
     * @param {any} _expirationDate
     * @param {any} _securityCode
     * @param {any} _Brand
     */
    function responsePositive(_IpgTransactionId, _name, _email, _cardNumber, _holder, _expirationDate, _securityCode, _Brand) {
        var response =
            "<div class='card-body'>"
            + "<div class='container mt-3'>"
            + "<div class='d-flex justify-content-center mb-3'>"
            + "<div class='p-2'><div class='logo_fam'></div>"
            + "</div>"
            + "</div>"
            + "<hr>"
            + "<h2 id='text-transform'>Obrigado!</h2>"
            + "<hr>"
            + "<p>O seu pagamento foi registrado com sucesso, abaixo segue os dados para confirmação:</p>"
            + "<h3 class='text-success'><strong>Protocolo:</strong> " + _IpgTransactionId + "</li></h3>"
            + "</div>"
            + "<div class='card-body'>"
            + "<ul class='mb-0'>"
            + "<li><strong>Nome:</strong> " + _name + "</li>"
            + "<li><strong>E-mail:</strong> " + _email + "</li>"
            + "</ul>"
            + "</div>"
            + "<hr>"
            + "<div class='card-body'>"
            + "<ul class='list-group'>"
            + "<li class='list-group-item list-group-item-secondary'><strong>Dados do pagamento</strong></li >"
            + "<li class='list-group-item'><strong>Nº do cartão:</strong> " + _cardNumber + "</li>"
            + "<li class='list-group-item'><strong>Titular do cartão:</strong> " + _holder + "</li>"
            + "<li class='list-group-item'><strong>Validade:</strong> " + _expirationDate + "</li>"
            + "<li class='list-group-item'><strong>CVV:</strong> " + _securityCode + "</li>"
            + "<li class='list-group-item'><strong>Bandeira:</strong> " + _Brand + "</li><br>"
            + "</ul>"
            + "<br>"
            + "<p class='font-weight-bold'>HORÁRIO DE FUNCIONAMENTO<br>Centro de Atendimento Financeiro (CAC)</p>"
            + "<p>De segunda a sexta-feira, das 8h às 20h30, e, aos sábados, das 8h às 13h.</p>"
            + "<hr>"
            + "<p class='font-weight-bold'>(11) 3003-6644<br><small>(São Paulo – Capital e Regiões Metropolitanas)</small></p>"

            + "<p class='font-weight-bold'>0800-727-4660<br><small>(Demais localidades)</small></p>"
            + "</div>";
        return response;
    }

    function responseNegative(_IpgTransactionId, _error) {
        var response =
            "<div class='card-body'>"
            + "<div class='container mt-3'>"
            + "<div class='d-flex justify-content-center mb-3'>"
            + "<div class='p-2'><div class='logo_fam'></div>"
            + "</div>"
            + "</div>"
            + "<hr>"
            + "<h2 id='text-transform'>Ops...</h2>"
            + "<hr>"
            + "<p>Não foi possível concluir sua solicitação, favor verificar as informações registradas e tente novamente.</p>"
            + "<h3 class='text-danger'><strong>Protocolo:</strong> " + _IpgTransactionId + "</li></h3>"
            + "</div>"
            + "<div class='card-body'>"
            + "<p><strong>Erro:</strong></p>"
            + "<p><span>\"</span>" + _error + "<span>\"</span></p>"
            + "<ul class='mb-0'>"
            + "</ul>"
            + "</div>"
            + "<hr>"
            + "<div class='card-body'>"
            + "<br>"
            + "<p class='font-weight-bold'>HORÁRIO DE FUNCIONAMENTO<br>Centro de Atendimento Financeiro (CAC)</p>"
            + "<p>De segunda a sexta-feira, das 8h às 20h30, e, aos sábados, das 8h às 13h.</p>"
            + "<hr>"
            + "<p class='font-weight-bold'>(11) 3003-6644<br><small>(São Paulo – Capital e Regiões Metropolitanas)</small></p>"

            + "<p class='font-weight-bold'>0800-727-4660<br><small>(Demais localidades)</small></p>"
            + "</div>";
        return response;
    }

    function responseError() {
        var response =
            "<div class='card-body'>"
            + "<div class='container mt-3'>"
            + "<div class='d-flex justify-content-center mb-3'>"
            + "<div class='p-2'><div class='logo_fam'></div>"
            + "</div>"
            + "</div>"
            + "<hr>"
            + "<h2 id='text-transform'>Ops...</h2>"
            + "<hr>"
            + "<p>Não foi possível atender sua solicitação.</p>"
            + "</div>"
            + "<div class='card-body'>"
            + "<p><strong>Erro:</strong></p>"
            + "<p><span>\"</span>Verifique as informações inseridas e tente novamente.<span>\"</span></p>"
            + "<ul class='mb-0'>"
            + "</ul>"
            + "</div>"
            + "<hr>"
            + "<div class='card-body'>"
            + "<br>"
            + "<p class='font-weight-bold'>HORÁRIO DE FUNCIONAMENTO<br>Centro de Atendimento Financeiro (CAC)</p>"
            + "<p>De segunda a sexta-feira, das 8h às 20h30, e, aos sábados, das 8h às 13h.</p>"
            + "<hr>"
            + "<p class='font-weight-bold'>(11) 3003-6644<br><small>(São Paulo – Capital e Regiões Metropolitanas)</small></p>"

            + "<p class='font-weight-bold'>0800-727-4660<br><small>(Demais localidades)</small></p>"
            + "</div>";
        return response;
    }
});