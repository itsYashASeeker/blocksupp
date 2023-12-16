// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract Supply{
    address public owner;
    uint public adminCount;

    struct AdminI {
        uint adminId;
        address adminAdd;
        string name;
        string company_name;
    }

    struct SupplierI {
        uint supplierId;
        address supplierDD;
        string name;
    }

    struct WorkerI {
        uint workerId;
        address workerDD;
        string name;
    }

    struct ProductInfo{
        uint productId;
        string name;
        uint adminId;
    }

    struct ProductIT{
        uint healthPerc;
        address workerA;
        string place;
        string time;
        uint productId;
    }

    event success(string msg);
    mapping(address => AdminI) public adminsM;
    mapping(address => SupplierI[]) public supplierM;
    mapping(address => WorkerI[]) public workerM;
    mapping(uint => ProductIT[]) public productIM;

    AdminI[] public adminSt;
    SupplierI[] public supplierSt;
    WorkerI[] public workerSt;
    ProductInfo[] public productSt;
    // AdminI[] public adminSt;


    constructor() {
        owner = msg.sender;
        adminCount=0;
    }

    function registerNewAdmin(
        string memory _name,
        string memory _company_name
        ) public {

            AdminI memory newAdmins = AdminI({
                adminId: adminCount+1,
                adminAdd: msg.sender,
                name: _name,
                company_name: _company_name
            }); 
            adminsM[msg.sender] = newAdmins; 
            adminSt.push(newAdmins);
            adminCount++;
            
            emit success("Admin registered!!");
        
        }

    function registerNewSupplier(
        string memory _name,
        address _adminAdd
        ) public {
            SupplierI memory newSupplier = SupplierI({
                supplierId: supplierM[_adminAdd].length,
                supplierDD: msg.sender,
                name: _name
            }); 

            supplierM[_adminAdd].push(newSupplier); 
            // adminSt.push(newAdmins); 
            // adminCount++;
            
            emit success("Supply registered!!");
        
        }
        
    function registerNewWorker(
        string memory _name,
        address _suppAdd
        ) public {
            WorkerI memory newWorker = WorkerI({
                workerId: workerM[_suppAdd].length,
                workerDD: msg.sender,
                name: _name
            }); 

            workerM[_suppAdd].push(newWorker); 
            // adminSt.push(newAdmins); 
            // adminCount++;
            
            emit success("Worker registered!!");
        
        }

    function addProduct(
        string memory _name,
        uint _adminId
        ) public{
        ProductInfo memory newProduct = ProductInfo({
            productId: productSt.length,
            name: _name,
            adminId: _adminId
        });
        productSt.push(newProduct);
    }

    function addProductTInfo(
            uint _healthPerc,
            string memory _place,
            string memory _time,
            uint _productId
        ) public{
            ProductIT memory newProductIT = ProductIT({
                healthPerc: _healthPerc,
                workerA: msg.sender,
                place: _place,
                time: _time,
                productId: _productId
            });

            productIM[_productId].push(newProductIT);
        }

    function viewAllAdmins() public view returns(AdminI[] memory){
        return adminSt;
    }

    function viewAllSuppliers(address _adminAdd) public view returns(SupplierI[] memory){
        return supplierM[_adminAdd];
    }

    function viewAllWorkers(address _adminAdd) public view returns(WorkerI[] memory){
        return workerM[_adminAdd];
    }

    function getAllProducts() public view returns(ProductInfo[] memory){
        return productSt;
    }

    function getProductHist(uint _productId) public view returns(ProductIT[] memory){
        return productIM[_productId];
    }

}