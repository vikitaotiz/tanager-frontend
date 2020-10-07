<template>
  <div>
    <v-card
          dark
          color="primary"
          style="margin-bottom: 1%;"
              >
        <v-list-item>
            <v-list-item-action>
                <v-btn text @click="back">
                  <v-icon>mdi-arrow-left</v-icon> Back
                </v-btn>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title><v-icon class="mr-1">mdi-read</v-icon> Ready Orders</v-list-item-title>
            </v-list-item-content>

            <v-list-item-content>
              <v-list-item-title>
                Ksh {{totalCost5(data)}}
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-content v-if="data.length > 1 && loggedInUser.data.role === 'Administrator'">
              <v-btn @click="openMergeDialog" dark color="success">
                <v-icon>mdi-merge</v-icon>
                Merge Tables</v-btn>
            </v-list-item-content>

          </v-list-item>
        </v-card>

    <v-row no-gutters>
      <v-col cols="12" sm="8">
        <v-card outlined tile class="pa-2">

          <v-data-iterator
                  :items="data"
                  :items-per-page.sync="itemsPerPage"
                >
                  <template v-slot:default="props">
                    <v-row>
                      <v-col
                        v-for="(product, index) in props.items"
                        :key="index"
                        cols="12"
                        md="4"
                      >
                        <v-card>
                          <v-list dense dark :class="{primaryy: !product.freaze}">
                            <v-list-item>
                              <div>
                                <b>{{product.table}}</b>
                                <v-divider color="white"></v-divider>
                                  Total : Ksh {{product.amount}}
                                <v-divider color="white"></v-divider>
                                <small>Order Created By <b>{{product.user_name}}</b><br>
                               Created On: <b>{{product.time}}</b></small>
                               <v-divider color="white" ></v-divider>
                                  <v-btn text v-if="!product.freaze" color="yellow" block small @click="addToTable(product)">Add Product</v-btn>
                               </div>
                            </v-list-item>
                          </v-list>

                          <v-divider></v-divider>

                          <v-expansion-panels>
                            <v-expansion-panel>
                              <v-expansion-panel-header><small><u>More Details...</u></small></v-expansion-panel-header>
                              <v-expansion-panel-content class="testReset">

                                <v-list dense>
                                <v-list-item>

                                  <v-simple-table dense>
                                    <template v-slot:default>
                                      <thead>
                                        <tr>
                                          <th class="text-left">Qty</th>
                                          <th class="text-left">Name</th>
                                          <th class="text-left" v-if="product.content.length > 1 && loggedInUser.data.role === 'Administrator'" >Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr v-for="(item, index) in product.content" :key="index">
                                          <td>{{ item.qty }}</td>
                                          <td>
                                            <small><b>{{ item.name }}</b><br>
                                            Amount: Ksh {{item.selling_price}}
                                            </small>
                                          </td>
                                          <td><v-icon v-if="product.content.length > 1 && loggedInUser.data.role === 'Administrator'" dark color="red" @click="voidSingleItem(product, item, index)">mdi-delete</v-icon></td>
                                        </tr>
                                        <tr style="background: #ddd;">
                                          <td>Total</td>
                                          <td>{{product.amount}}</td>
                                        </tr>
                                      </tbody>
                                    </template>
                                  </v-simple-table>

                                </v-list-item>

                                <v-divider></v-divider>

                              </v-list>
                              <v-card-actions v-if="product.freaze">
                                Waiting for added Items
                              </v-card-actions>
                             <v-card-actions v-else>
                               <v-row no-gutters>
                                 <v-col cols="12" class="mb-2" v-if="loggedInUser.data.role === 'Administrator'">
                                   <v-btn small tile depressed color="orange" block @click="openConfirm(product)">
                                     <v-icon small>mdi-cancel</v-icon> Void
                                  </v-btn>
                                 </v-col>
                                 <v-col cols="12" class="mb-2">
                                   <v-btn small tile depressed color="orange" block @click="printBillTable(product, product.amount)">
                                     <v-icon small>mdi-printer</v-icon> Print
                                  </v-btn>
                                 </v-col>
                                 <v-col cols="12" class="mb-2">
                                   <v-btn small tile depressed color="primary" block v-if="product.content.length > 1"
                                      @click="openSplit(product)">
                                     <v-icon small>mdi-arrow-split-vertical</v-icon> Split
                                  </v-btn>
                                 </v-col>
                                 <v-col cols="12" v-if="loggedInUser.data.role === 'Administrator'">
                                   <v-btn small tile depressed color="primary" block @click="payOrder(product)">
                                     <v-icon small>mdi-credit-card</v-icon> Pay
                                  </v-btn>
                                 </v-col>
                               </v-row>
                              </v-card-actions>

                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-expansion-panels>

                        </v-card>
                      </v-col>
                    </v-row>
                  </template>

                </v-data-iterator>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4" v-if="bills.length > 0">
        <v-card class="pa-2">
          <v-card color="primary" outlined v-for="(single_bill, index) in bills" :key="index" class="mb-2">
                    <v-btn dense dark color="orange" block text>New Bill. Amount: Ksh {{totalCost4(single_bill.content)}}</v-btn>
                              <v-divider></v-divider>
                            <v-simple-table style="width: 100%;" dense>
                                <template v-slot:default>
                                  <thead>
                                    <tr>
                                      <th class="text-left">Qty</th>
                                      <th class="text-left">Name</th>
                                      <th class="text-left">Amount (Ksh)</th>
                                    </tr>
                                  </thead>
                                  <tbody>


                                    <tr v-for="(product, index) in single_bill.content" :key="index">
                                      <td>{{product.qty}}</td>
                                      <td>
                                        <small><b>{{ product.name }}</b></small>
                                      </td>
                                      <td>
                                        {{product.selling_price}}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <v-btn small color="orange" text @click="printBillTable(single_bill, single_bill.amount)">
                                          <v-icon small>mdi-printer</v-icon> Print
                                        </v-btn>
                                      </td>

                                      <td v-if="loggedInUser.data.role === 'Administrator'">
                                        <v-btn small color="primary" text @click="payOrder1(single_bill, totalCost4(single_bill.content))">
                                          <v-icon small>mdi-credit-card</v-icon> Pay
                                        </v-btn>
                                      </td>

                                      <td v-if="loggedInUser.data.role === 'Administrator'">
                                        <v-btn small color="orange" text @click="openConfirmBill(single_bill, index)">
                                          <v-icon small>mdi-credit-card</v-icon> Void
                                        </v-btn>
                                      </td>
                                    </tr>

                                  </tbody>
                                </template>
                              </v-simple-table>

               </v-card>
        </v-card>
      </v-col>
    </v-row>

    <!-- Fullscreen Split Dialog -->
    <v-dialog v-if="product_table !== null" v-model="dialogSplit" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card outlined >
        <v-toolbar dark color="primary">
          <v-btn class="ml-3" icon dark @click="closeDialogSplit(product_table)">
            <v-icon>mdi-close</v-icon> Cancel
          </v-btn>
          <v-toolbar-title><v-icon class="ml-5" large>mdi-table-split-cell</v-icon> Split {{product_table.table}} </v-toolbar-title>
          <v-spacer></v-spacer>

          <v-toolbar-items  v-if="product_bills.length > 0">
            <v-btn dark color="orange" @click="saveDialogSplit(product_table)">
              <v-icon large>mdi-content-save</v-icon>
              Save Bill(s)</v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-row class="ma-2">
          <v-col
            cols="12"
            sm="6"
            class="pa-2"

          >
            <v-card tile class="pa-1">

              <v-simple-table>
                      <thead style="background: #ddd;">
                        <th>Qty</th>
                        <th>Name</th>
                        <th>Amount (Ksh)</th>
                        <th>Action</th>
                      </thead>
                      <tbody>
                        <tr v-for="(product, index) in product_table.content" :key="index">
                          <td>{{product.qty}}</td>
                          <td>{{product.name}}</td>
                          <td>{{product.selling_price}}</td>
                          <td><v-btn text dark color="primary" small @click="splitTableProduct(product)">
                            <v-icon small>mdi-table-split-cell</v-icon>
                            Split</v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>

            </v-card>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            v-if="product_bills.length > 0"
          >
            <v-card tile class="pa-1">

              <div v-for="(product, index) in product_bills" :key="index" >
                <v-card outlined tile class="mb-2">
                  <v-list style="background: #ddd;">
                    <v-list-item-group>
                      <v-list-item>

                        <v-list-item-action>
                           Bill {{index}}
                         </v-list-item-action>

                        <v-list-item-content>
                          <v-list-item-title>Amount: Ksh {{totalCost4(product.data_content)}}</v-list-item-title>
                        </v-list-item-content>


                      </v-list-item>
                    </v-list-item-group>
                  </v-list>

                  <v-card-text>
                    <v-simple-table>
                            <template v-slot:default>
                              <thead>
                                <tr>
                                  <th class="text-left">Qty</th>
                                  <th class="text-left">Item</th>
                                  <th class="text-left">Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="item in product.data_content" :key="item.name">
                                  <td>{{ item.qty }}</td>
                                  <td>{{ item.name }}</td>
                                  <td>{{ item.selling_price }}</td>
                                </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                  </v-card-text>
                </v-card>
              </div>


            </v-card>
          </v-col>
        </v-row>

      </v-card>
    </v-dialog>
    <!-- End of Fullscreen Split Dialog -->

    <!-- Add Products Dialog -->
    <v-dialog
      v-model="dialogAdd"
      width="750"
      scrollable
      persistent
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
        <v-icon>mdi-plus-outline</v-icon>
          Add Items To {{added_product.table}}.
          <v-spacer /> Amount: Ksh{{added_product.amount}}
        </v-card-title>

        <v-card-text style="height: 300px;">
          <v-row no-gutters class="mt-3">
            <v-col cols="12" sm="6">
              <v-card outlined class="pa-1">

                <v-tabs centered v-model="tab">
                    <v-tab key="non_drink">
                      Food
                    </v-tab>

                    <v-tab key="drink">
                      Drinks
                    </v-tab>
                  </v-tabs>

                  <v-tabs-items v-model="tab">
                    <v-tab-item key="non_drink">

                      <v-text-field class="mt-2" v-model="added_products_search" label="Search for food..." outlined dense />

                          <v-list dense class="v-card mb-1" v-for="(product, index) in filteredProducts(non_drinks_added)" :key="index">
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title><b>{{product.name}}</b>. Ksh {{product.selling_price}}</v-list-item-title>
                              </v-list-item-content>

                              <v-list-item-content>
                                <v-list-item-title>{{product.category}}</v-list-item-title>
                              </v-list-item-content>

                              <v-list-item-icon>
                                <v-icon color="primary" @click="addNewTableProduct(product, index)">mdi-plus-circle</v-icon>
                              </v-list-item-icon>
                            </v-list-item>
                          </v-list>

                    </v-tab-item>

                    <v-tab-item key="drink">

                      <v-text-field class="mt-2" v-model="added_products_search" label="Search for drinks..." outlined dense />

                          <v-list dense class="v-card mb-1" v-for="(product, index) in filteredProducts(drinks_added)" :key="index">
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title><b>{{product.name}}</b>. Ksh {{product.selling_price}}</v-list-item-title>
                              </v-list-item-content>

                              <v-list-item-content>
                                <v-list-item-title>{{product.category}}</v-list-item-title>
                              </v-list-item-content>

                              <v-list-item-icon>
                                <v-icon color="primary" @click="addNewTableProduct(product, index)">mdi-plus-circle</v-icon>
                              </v-list-item-icon>
                            </v-list-item>
                          </v-list>

                    </v-tab-item>
                  </v-tabs-items>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6">
              <v-card outlined class="pa-1">
                <v-card outlined class="pa-1">
                  <v-card-subtitle>Current Table Items</v-card-subtitle>
                  <v-chip
                    class="ma-1"
                    color="primary"
                    text-color="white"
                    small
                    v-for="(item, index) in added_product.content"
                    :key="index"
                  >
                    {{item.name}}. Ksh{{item.selling_price}}
                  </v-chip>
                </v-card>

                <v-card outlined class="pa-1" v-if="new_table_products.length > 0">
                  <v-card-subtitle>Added Items
                    <v-spacer><b>New Amount Ksh {{added_product.amount + totalCost3()}}</b></v-spacer>
                  </v-card-subtitle>

                    <v-chip
                      class="ma-1"
                      close
                      small
                      color="primary"
                      label
                      outlined
                      @click:close="removeNewTableProduct(index)"
                      v-for="(prd, index) in new_table_products" :key="index"
                    >
                      {{prd.name}}. Ksh{{prd.selling_price}}

                    </v-chip>

                </v-card>

              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="headline grey lighten-2">

          <v-btn
            color="red"
            text
            @click="closeDialogAdd"
          >
          <v-icon small>mdi-cancel</v-icon>
            Cancel
          </v-btn>

          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            @click="sendAddedItemsToKitchen"
            v-if="new_table_products.length > 0"
          >
            <v-icon small>mdi-skip-backward-outline</v-icon> Send Order
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End of Add Products Dialog -->

    <!-- Void Products Dialog -->
    <v-dialog v-model="dialogVoid" persistent max-width="400">
      <v-card>
        <v-card-title v-if="void_bill" class="headline">Void this bill?</v-card-title>
        <v-card-title v-else class="headline">Void Order for {{table_order.table}}?</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-3">
            <v-overflow-btn
              dense
              :items="users"
              label="Add User Requesting Void..."
              item-text="name"
              item-value="name"
              v-model="user_requesting_void"
            ></v-overflow-btn>
            <v-select
              v-if="user_requesting_void"
              dense
              :items="voids"
              item-text="description"
              item-value="id"
              v-model="void_id"
              @change="enableYes"
              label="Select a reason for voiding..."
              outlined
            ></v-select>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogVoid = false">Cancel</v-btn>
          <v-spacer></v-spacer>

          <div v-if="void_bill">
            <v-btn color="primary" text v-if="yes" @click="voidTableBill">Confirm</v-btn>
          </div>

          <div v-else>
            <v-btn color="primary" text v-if="yes" @click="voidTable">Confirm</v-btn>
          </div>

        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End Void Products Dialog -->

    <!-- Merge Tables Dialog -->
    <v-dialog v-model="mergeDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card outlined >
        <v-toolbar dark color="primary">
          <v-btn class="ml-2" icon dark @click="closeDialogMerge">
            <v-icon>mdi-close</v-icon> Cancel
          </v-btn>
          <v-toolbar-title><v-icon class="ml-5">mdi-merge</v-icon> Merge Tables</v-toolbar-title>
          <v-toolbar-items>
          </v-toolbar-items>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark color="orange" @click="saveDialogMerge" v-if="bill.length > 0">
              <v-icon>mdi-content-save</v-icon> New Bill</v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-row class="ma-2">
          <v-col
            cols="12"
            sm="6"
            class="pa-2"
          >
            <v-card outlined tile class="pa-1" v-if="merge_table.length > 0">
              <v-card-title>
                <v-text-field v-model="search" label="Search tables... " dense outlined/>
              </v-card-title>

              <div v-for="(table, index) in filteredData(merge_table)" :key="index" >
                <v-card outlined tile class="mb-2">
                  <v-list style="background: #ddd;">
                    <v-list-item-group>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>{{table.table}}<br><small>({{table.user_name}})</small> </v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-content>
                          <v-list-item-title>Ksh {{table.amount}}</v-list-item-title>
                        </v-list-item-content>

                         <v-list-item-action>
                           <v-btn text color="primary" @click="mergeTable(table, index)">
                             <v-icon>mdi-merge</v-icon> Merge</v-btn>
                         </v-list-item-action>

                      </v-list-item>
                    </v-list-item-group>
                  </v-list>

                  <v-card-text>
                    <v-simple-table dense>
                      <thead>
                        <th>Name</th>
                        <th>Amount (Ksh)</th>
                      </thead>
                      <tbody>
                        <tr v-for="(product, index) in table.content" :key="index">
                          <td>{{product.name}}</td>
                          <td>{{product.selling_price}}</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </v-card-text>
                </v-card>
              </div>

            </v-card>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-card outlined tile class="pa-1" v-if="bill.length > 0">
                <v-list style="background: #ddd;">
                    <v-list-item-group>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>New Bill</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-content>
                          <v-list-item-title>Amount: Ksh {{totalCost()}}</v-list-item-title>
                        </v-list-item-content>

                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                    <v-simple-table bordered>
                      <thead>
                        <th class="text-left">Name</th>
                        <th class="text-left">Amount (Ksh)</th>
                      </thead>
                      <tbody>
                        <tr v-for="(product, index) in bill" :key="index">
                          <td>{{product.name}}</td>
                          <td>{{product.selling_price}}</td>
                        </tr>

                      </tbody>
                    </v-simple-table>

            </v-card>
          </v-col>
        </v-row>

      </v-card>
    </v-dialog>
    <!-- End Merge Tables Dialog -->

    <!-- Payment Dialog   -->
     <v-bottom-sheet v-model="sheet1" inset>
      <v-toolbar dark color="primary">
          <v-btn icon dark @click="sheet1 = !sheet1">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title><v-icon>mdi-credit-card</v-icon> Payment Mode</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-title> Amount Ksh {{payment_cost}}</v-toolbar-title>
        </v-toolbar>
      <v-sheet class="text-center" height="300px">
        <v-container class="grey lighten-5">
          <v-row>

            <v-radio-group v-model="payment_mode" :mandatory="false" row style="width: 100%;">
                <v-col
                  cols="12"
                  sm="3"
                >
                  <v-card
                    class="pa-2"
                    outlined
                    tile
                  >
                    <v-radio label="Cash" value="cash"></v-radio>

                  </v-card>
                </v-col>

                <v-col
                  cols="12"
                  sm="3"
                >
                  <v-card
                    class="pa-2"
                    outlined
                    tile
                  >
                    <v-radio label="Mpesa" value="mpesa"></v-radio>
                    <!-- <div v-if="payment_mode == 'mpesa'">
                        <v-text-field type="number" dense outlined label="Enter Mobile Number" v-model="mobile_number"/>
                        <v-btn small block
                          color="info"
                          @click="mpesaPayment"
                        >
                        <v-icon v-if="loading" small>mdi-check</v-icon>
                          <span v-if="!loading">Process Payment</span>
                          <span v-if="loading">Processing finished</span>
                        </v-btn>
                    </div> -->

                  </v-card>
                </v-col>

                <v-col
                  cols="12"
                  sm="3"
                >
                  <v-card
                    class="pa-2"
                    outlined
                    tile
                  >
                    <v-radio label="Card" value="card"></v-radio>
                  </v-card>
                </v-col>

                <v-col
                  cols="12"
                  sm="3"
                >
                  <v-card
                    class="pa-2"
                    outlined
                    tile
                  >
                    <v-radio label="Credit" value="credit"></v-radio>
                  </v-card>
                </v-col>

            </v-radio-group>

          </v-row>

          <div v-if="payment_mode == 'cash'">
            <v-row>
              <v-col>
                <v-text-field type="number" dense outlined label="Enter Amount Paid By Customer..." v-model="amount_paid" />
              </v-col>
              <v-col>
                <p style="background: #006064; padding: 1%; color: white;" v-if="amount_paid">
                  <strong>Balance Due: Ksh {{amount_paid - payment_cost}}</strong>
                </p>
              </v-col>
            </v-row>
            <div v-if="amount_paid">
              <v-btn v-if="bill_payment" block dark color="primary" @click="sendReadyToSaleBill">Save Transaction (Bill)</v-btn>
              <v-btn v-else block dark color="primary" @click="sendReadyToSale">Save Transaction</v-btn>
            </div>
          </div>

          <div v-if="payment_mode == 'credit'">
            <v-row>
              <v-col>
                <v-text-field dense outlined label="Enter Name of Creditor..." v-model="creditor_name" />
              </v-col>
            </v-row>
            <div v-if="creditor_name">
              <v-btn v-if="bill_payment" block dark color="primary" @click="sendReadyToSaleBill">Save Transaction (Bill)</v-btn>
              <v-btn v-else block dark color="primary" @click="sendReadyToSale">Save Transaction</v-btn>
            </div>
          </div>


          <div v-if="payment_mode !== 'cash'">
            <div v-if="payment_mode !== 'credit'">
              <v-btn v-if="bill_payment" block dark color="primary" @click="sendReadyToSaleBill">Save Transaction (Bill)</v-btn>
              <v-btn v-else block dark color="primary" @click="sendReadyToSale">Save Transaction</v-btn>
            </div>
          </div>

        </v-container>
      </v-sheet>
    </v-bottom-sheet>
    <!-- End Payment Dialog   -->

    <v-dialog v-model="voidSingleItemDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Void {{single_table_item_name}}?</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-3">
          <v-overflow-btn
              dense
              :items="users"
              label="Add User Requesting Void..."
              item-text="name"
              item-value="name"
              v-model="user_requesting_void"
            ></v-overflow-btn>
            <v-select
              v-if="user_requesting_void"
              dense
              :items="voids"
              item-text="description"
              item-value="id"
              v-model="void_id"
              @change="enableYes"
              label="Select a reason for voiding..."
              outlined
            ></v-select>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="voidSingleItemDialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text v-if="yes" @click="deleteSingleItem">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="bills_number" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Add Item to bill</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-3">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  small
                  block
                >
                  Add Item to Existing Bill?
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in split_bills"
                  :key="index"
                  @click="splitBill(item, index)"
                >
                  <v-list-item-title>Bill {{ index }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="red" text @click="bills_number = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="createNewBill">Create new bill</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogUserMerge"
      width="500"
      persistent
    >

      <v-card>
        <v-card-title class="headline grey lighten-2">
          Add User to bill
        </v-card-title>

        <v-card-text>
          <v-overflow-btn
            class="my-2"
            :items="users"
            item-value="name"
            item-text="name"
            label="Select waiter..."
            v-model="user_merge"
          ></v-overflow-btn>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            color="red"
            text
            @click="dialogUserMerge= false"
          >
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            v-if="user_merge"
            color="primary"
            text
            @click="saveDialogMergeWithUser"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import io from 'socket.io-client'
const socket = io(process.env.WS_URL)
if(process.client) {
  let print = require('print-js')
}

import moment from 'moment';

export default {
  data(){
    return {
      tab: null,
      drink_non_drink: [
        { tab: 'Drinks', content: 'Tab 1 Content' },
          { tab: 'Non Drinks', content: 'Tab 2 Content' }
      ],
      data: [],
      itemsPerPage: 4,
      search: '',
      page: 1,
      products: [],
      voids: [],

      mergeDialog: false,
      bill: [],
      merge_table: [],
      search: '',
      merged_tables: [],

      dialogAdd: false,
      added_product: '',
      added_products_search: '',
      drink_non_drink_products: [],
      drink_products: false,
      non_drink_products: false,
      new_table_products: [],

      dialogSplit: false,
      product_bills: [],
      bills: [],
      product_table: '',
      new_product_table: [],

      drinks_added: [],
      non_drinks_added: [],

      void_id: '',
      void_bill: false,
      dialogVoid: false,
      yes: false,
      table_order: '',
      voids: [],

      sheet1: false,
      payment_mode: 'cash',
      payment_cost: 0,
      prd: '',
      mobile_number: '',
      loading: false,
      bill_payment: false,

      billableTotal: '',
      billableData: [],

      voidSingleItemDialog: false,
      single_table_item_name: '',
      single_table_item_product: '',
      single_table_item_index: '',
      table_order_index: '',

      bills_number: false,
      split_bills: [],
      split_bill_number: '',
      item_tobe_split: '',

      dialogUserMerge: false,
      users: [],
      user_merge: '',
      user_requesting_void: '',
      amount_paid: 0,
      creditor_name: ''
    }
  },

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },

  created(){
    this.fetchReadies()
    this.fetchProducts()
    this.fetchCancels()
    this.fetchBills()
    this.fetchUsers()

    socket.on('single_item_deleted_ready', data1 =>{
      this.data = [];
      this.fetchReadies();
    })
  },

  methods:{
    back(){
      this.$router.back();
    },

    fetchUsers(){
      this.$axios.get(`/users`)
      .then(res => {
        let ar4 = []
        res.data.data.forEach(val => {
          let data = {
            name: val.name,
            role: val.role
          }
          ar4.push(data)
        });
        this.users = ar4.filter(el => {
          return el.role === 'Normal User'
        })
      })
      .catch()
    },

    // Filter Functions
    filteredProducts(products){
        return products.filter((text) => {
          return  text.name.toLowerCase().includes(this.added_products_search.toLowerCase())
        })
      },

    filteredData(merge_table){
        return merge_table.filter((text) => {
          return  text.table.toLowerCase().includes(this.search.toLowerCase())
        })
      },

    fetchReadies(){
      let ar1 = []

      if(this.loggedInUser.data.role === "Administrator"){
        this.$axios.get(`/readies`)
        .then(res => {
          res.data.data.forEach(val => {
              let table = {
                  id: val.id,
                  sold: val.sold,
                  amount: val.amount,
                  content: JSON.parse(val.content),
                  time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                  user_name: val.user_order,
                  freaze: val.freaze,
                  merged: val.merged,
                  split: val.split,
                  table: val.table_name
                }

              this.data.push(table)
              });
        })
        .catch(err => {
          console.log(err)
        })

      } else {

        this.$axios.get(`/readies`)
        .then(res => {
          res.data.data.forEach(val => {
              let table = {
                  id: val.id,
                  sold: val.sold,
                  amount: val.amount,
                  content: JSON.parse(val.content),
                  time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                  user_name: val.user_order,
                  freaze: val.freaze,
                  merged: val.merged,
                  split: val.split,
                  table: val.table_name
              }
               ar1.push(table)
              });

              this.data  = ar1.filter(el=>{
                return el.user_name === this.loggedInUser.data.name
              })

        })
        .catch(err => {
          console.log(err)
        })
      }
    },

    fetchProducts(){
      this.$axios.get(`/products`)
        .then(response => {
           this.products = response.data.data;
         })
        .catch(error => {
          console.log(error.data);
      })
    },

    fetchCancels(){
      this.$axios.get(`/cancels`)
        .then(response => {
           this.voids = response.data.data;
         })
        .catch(error => {
          console.log(error.data);
      })
    },

    fetchBills(){

      let ar3 = []

      if(this.loggedInUser.data.role === "Administrator"){
        this.$axios.get(`/bills`)
          .then(res => {
            res.data.data.forEach(val => {
                let table = {
                    id: val.id,
                    sold: val.sold,
                    amount: val.amount,
                    content: JSON.parse(val.content),
                    time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                    user_name: val.user_order,
                    freaze: val.freaze,
                    merged: val.merged,
                    split: val.split,
                    table: val.table
                  }
                this.bills.push(table)
                });
          })
          .catch(error => {
        })
      } else {
        this.$axios.get(`/bills`)
          .then(res => {
            res.data.data.forEach(val => {
                let table = {
                    id: val.id,
                    sold: val.sold,
                    amount: val.amount,
                    content: JSON.parse(val.content),
                    time: val.created_at,
                    time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                    user_name: val.user_order,
                    freaze: val.freaze,
                    merged: val.merged,
                    split: val.split,
                    table: val.table
                  }
                ar3.push(table)
                });

              this.bills = ar3.filter(el=>{
                return el.user_name === this.loggedInUser.data.name
              })
          })
          .catch(error => {
        })
      }
    },

    //Merge Tables Dialog Functions
    openMergeDialog(){
      this.data.forEach(val => {
        if(val.freaze == 0 && val.split == 0){
          this.merge_table.push(val)
        }
      })

      // console.log(this.merge_table)

      this.mergeDialog = !this.mergeDialog
    },

    mergeTable(table, index){
        this.merged_tables.push(table)
        this.merge_table.splice(index, 1)
        table.content.forEach(item => {
          this.bill.push(item)
        })
    },

    closeDialogMerge(){
      this.data  = []
      this.fetchReadies()

      this.mergeDialog = false;
      this.bill = []
      this.merge_table = []
    },

    totalCost(){
        let cost = []
        if(this.bill.length > 0){
           this.bill.forEach(val => {
            cost.push(val.selling_price)
          })
          let sum = cost.reduce((a, b)=>{
            return a + b
          })
          this.show_col = true;
          return sum
        } else {
          return 0
        }
      },

      totalCost4(arr){
        let cost = []
        if(arr.length > 0){
           arr.forEach(val => {
            cost.push(val.selling_price)
          })
          let sum = cost.reduce((a, b)=>{
            return a + b
          })
          return sum
        } else {
          return 0
        }
      },

    saveDialogMerge(){

      let readies_sucess = false
      this.dialogUserMerge = true

    },

    saveDialogMergeWithUser(){

      this.dialogUserMerge = false

      this.merged_tables.forEach(val => {
        this.$axios.delete(`/readies/${val.id}`).then( res => {
          readies_sucess = true
        })
      })

      let new_ready_table = {
          user_order: this.user_merge,
          table: 'Merged Table',
          split: 0,
          sold: 0,
          amount: this.totalCost(),
          merged: 1,
          freaze: 0,
          content: JSON.stringify(this.bill),
          user_id: this.loggedInUser.data.id
      }

      this.$axios.post(`/bills`, new_ready_table).then(res => {
        this.$toast.success('Bill Created Successfully!', {
            duration: 2000
        })
      })

      this.mergeDialog = false;
      this.data = []
      this.fetchBills()

    this.bill = []
      this.merge_table = []
      this.fetchReadies()
    },

    //Add Products Functions
    addToTable(product){

      this.added_product = product;

        let product_drinks = this.products.filter(val=>{
           return val.item_type === 'drink'
        })
        this.drinks_added = product_drinks

        let product_non_drinks = this.products.filter(val=>{
            return val.item_type === 'non_drink'
        })
        this.non_drinks_added = product_non_drinks

      this.dialogAdd = true
    },

    addNewTableProduct(product){
      let new_product = {
         qty: 1,
         name: product.name,
         selling_price: product.selling_price,
         item_type: product.item_type
      }
      this.new_table_products.push(new_product)
    },

    totalCost3(){
        if(this.new_table_products.length > 0){
            let cost = []
            this.new_table_products.forEach(val => {
              cost.push(val.selling_price)
            })
            let sum = cost.reduce((a, b)=>{
              return a + b
            })
            return sum }
          else {
            return 0
          }
      },

      totalCost4(content){
        let cost = []
        content.forEach(val => {
            cost.push(val.selling_price)
        })
        let sum = cost.reduce((a, b)=>{
           return a + b
        })
        return sum
      },

      totalCost5(content){
        if(content.length > 0){
            let cost = []
            content.forEach(val => {
              cost.push(val.amount)
            })
            let sum = cost.reduce((a, b)=>{
              return a + b
            })
            return sum }
          else {
            return 0
          }
      },

  sendAddedItemsToKitchen(){
      this.dialogAdd = false

      let data1 = {
        user_id: this.loggedInUser.data.id,
        user_order: this.added_product.user_name,
        amount: this.added_product.amount,
        table_name: this.added_product.table,
        content: JSON.stringify(this.added_product.content),
        freaze: 1,
        merged: 0,
        split: 0,
        sold: 0
      }

      this.$axios.patch(`/readies/${this.added_product.id}`, data1)
      .then(res => {
        this.added_product.freaze = 1

        //Use filter to extract drinks from array content
        let drinks = this.new_table_products.filter(val => {
          return val.item_type === 'drink'
        })
        //Use filter to extract non drinks from array content
        let non_drinks = this.new_table_products.filter(val => {
          return val.item_type === 'non_drink'
        })

        if(drinks.length>0){
          let data2 = {
            user_order: this.added_product.user_name,
            content: JSON.stringify(drinks),
            table_name: this.added_product.table,
            table_id: this.added_product.id,
            amount: this.totalCost4(drinks),
            user_id: this.loggedInUser.data.id
          }

          this.$axios.post('/adddrinks', data2)
          .then(res => {
            socket.emit('additionalItem_to_barista_from_ready', data2)
            this.$toast.success('Additional Order Sent to Barista!', {
              duration: 2000
            })
          })
          .catch(err => {
            console.log(err)
          })
        }

        if(non_drinks.length>0){
          let data3 = {
            user_order: this.added_product.user_name,
            qty: 1,
            content: JSON.stringify(non_drinks),
            table_name: this.added_product.table,
            table_id: this.added_product.id,
            amount: this.totalCost4(non_drinks),
            user_id: this.loggedInUser.data.id
          }

          this.$axios.post('/adds', data3)
          .then(res => {
            socket.emit('additionalItem_to_kitchen_from_ready', data3)
            this.$toast.success('Additional Order Sent to Kitchen!', {
              duration: 2000
            })
          })
          .catch(err => {
            console.log(err)
          })
        }

          this.new_table_products = []

      })
      .catch(err => {
        console.log(err)
      })

    },

    removeNewTableProduct(index){
      this.new_table_products.splice(index, 1)
    },

    closeDialogAdd(){
      this.new_table_products = []
      this.dialogAdd = false
    },

    //Split Table Functions
    openSplit(product){
      this.product_table = product
      this.dialogSplit = true
    },

    closeDialogSplit(){
      this.data = []
      this.dialogSplit = false,
      this.product_bills = []
      this.new_product_table = []
      this.fetchReadies()
    },

    splitTableProduct(product){
      this.item_tobe_split = product

      if(this.new_product_table.length === 0){
        let arr = []
        arr.push(product)
        let data = {
          info : {
            user_name: this.product_table.user_name,
            table: this.product_table.table,
          },
          data_content: arr
        }

        let product_index = this.product_table.content.indexOf(product)
        this.product_table.content.splice(product_index, 1)
        this.new_product_table.push(data)
        this.product_bills = this.new_product_table

      } else {
          this.split_bills = this.new_product_table
          this.bills_number = true
      }
    },

    splitBill(item, index){
      this.split_bills[index].data_content.push(this.item_tobe_split)
      let product_index = this.product_table.content.indexOf(this.item_tobe_split)
      this.product_table.content.splice(product_index, 1)
      this.bills_number = false
    },

    createNewBill(){

        let arr = []
        arr.push(this.item_tobe_split)
        let data = {
          info : {
            user_name: this.product_table.user_name,
            table: this.product_table.table,
          },
          data_content: arr
        }

        let product_index = this.product_table.content.indexOf(this.item_tobe_split)
        this.product_table.content.splice(product_index, 1)
        this.new_product_table.push(data)
        this.product_bills = this.new_product_table
        this.bills_number = false
    },

    saveDialogSplit(item){

      let new_total_sum = 0;
      if(item.content.length > 0){
        let cost = []
        item.content.forEach(val => {
          cost.push(val.selling_price)
        })
        new_total_sum = cost.reduce((a, b)=>{
          return a + b;
        })
      }

      this.split_bills.forEach(val => {
        let new_ready_table = {
          split: this.product_table.split,
          sold: 0,
          amount: this.product_table.amount,
          merged: this.product_table.merged,
          freaze: this.product_table.freaze,
          content: JSON.stringify(val.data_content),
          user_order: this.product_table.user_name,
          table: this.product_table.table,
          user_id: this.loggedInUser.data.id
        }

        this.$axios.post(`/bills`, new_ready_table)
          .then(res => {
             this.$toast.success('Bills Saved Successfully!', {
                  duration: 2000
             })
          })
        })

        let new_ready_table_data = {
            split: this.product_table.split,
            sold: 0,
            amount: new_total_sum,
            merged: this.product_table.merged,
            freaze: this.product_table.freaze,
            content: JSON.stringify(this.product_table.content),
            user_order: this.product_table.user_name,
            table_name: this.product_table.table,
            time: this.product_table.time
          }

        this.$axios.patch(`/readies/${this.product_table.id}`, new_ready_table_data)
        if(this.product_table.content.length === 0){
            this.$axios.delete(`/readies/${this.product_table.id}`).then()
        } else {
            this.new_product_table.forEach(val => {
              let new_ready_table = {
                split: this.product_table.split,
                sold: 0,
                amount: this.product_table.amount,
                merged: this.product_table.merged,
                freaze: this.product_table.freaze,
                content: JSON.stringify(val.data_content),
                user_order: this.product_table.user_name,
                table: this.product_table.table,
                user_id: this.loggedInUser.data.id
              }

              this.$axios.post(`/bills`, new_ready_table)
                .then(res => {
                  this.$toast.success('Bills Saved Successfully!', {
                        duration: 2000
                  })
                })
              })
            }

        this.dialogSplit = false;
        this.bills = []
        this.data = []
        this.product_bills = []
        this.new_product_table = []
        this.fetchReadies()
        this.fetchBills()

    },
    //End of Split Table Functions


    //Table Void Functions
    openConfirm(product){
      this.void_bill = false
      this.table_order = product
      this.dialogVoid = true
    },

    openConfirmBill(product, index){
      this.void_bill = true
      this.table_order = product
      this.table_order_index = index
      this.dialogVoid = true
    },

    enableYes(){
      this.yes = true
    },

    voidTable(){
      if(typeof this.void_id == 'number'){
        this.dialogVoid = false

        let table_index = this.data.indexOf(this.table_order)
        let id = this.table_order.id;

        let data = {
          user_requesting_void: this.user_requesting_void,
          module: 'Table Order Ready',
          content: JSON.stringify(this.table_order),
          user_id: this.loggedInUser.data.id,
          cancel_id: this.void_id
        }

        this.$axios.post('/loggers', data).then(res => {

          this.$axios.delete(`/readies/${id}`)
            .then(res => {
                socket.emit('removeTableFromReadies', table_index)
                this.data.splice(table_index, 1)
                this.$toast.success('Table Order has been voided!', {
                    duration: 1000
                })
              })
            .catch(error => { console.log(error) })
        }).catch(err => {console.log(err)})
      }
    },

    voidTableBill(){
      let table_index = this.bills.indexOf(this.table_order)

      if(typeof this.void_id == 'number'){
        this.dialogVoid = false

        let id = this.table_order.id;
        let data = {
          user_requesting_void: this.user_requesting_void,
          module: 'Generated Bill Ready',
          content: JSON.stringify(this.table_order),
          user_id: this.loggedInUser.data.id,
          cancel_id: this.void_id
        }

        this.$axios.post('/loggers', data).then(res => {
          this.$axios.delete(`/bills/${id}`)
            .then(res => {
                socket.emit('removeTableFromReadies', table_index)
                this.bills.splice(table_index , 1)
                this.$toast.success('Bill has been voided!', {
                    duration: 1000
                })
              })
            .catch(error => { console.log(error) })
        }).catch(err => {console.log(err)})
      }
    },

    //Payment Functions
    payOrder(product){
      this.bill_payment = false
      this.prod = product
      this.payment_cost = product.amount
      this.sheet1 = true
    },

    payOrder1(product, amount){
      this.bill_payment = true
      this.prod = product
      this.payment_cost = amount
      this.sheet1 = true
    },

    mpesaPayment(){
      let data = {
        amount: this.payment_cost,
        contact: this.mobile_number
      }
      this.$axios.post(`/mpesapay`, data).then(res => {

            this.loading= true
            this.$toast.show('Ask Customer to Enter His/Her Mpesa to proceed', {
              duration: 5000
            })
      }).catch(error => {
        this.$toast.error('There was an error processing mpesa payment.', {
          duration: 3000
        })
      })
    },

    sendReadyToSale(){
      let data4 = {
          user_order: this.prod.user_name,
          user_id: this.loggedInUser.data.id,
          sold: 1,
          payment_mode: this.payment_mode,
          amount: this.payment_cost,
          amount_paid: this.payment_cost,
          balance: 0,
          creditor_name: this.creditor_name,
          content: JSON.stringify(this.prod.content)
        }

      if(this.payment_mode === 'cash'){
        let balance = 0;
        if(this.amount_paid > 0){
          balance = this.amount_paid - this.payment_cost;
        } else if(this.amount_paid === this.payment_cost){
          balance = 0
        }

        let data3 = {
          user_order: this.prod.user_name,
          user_id: this.loggedInUser.data.id,
          sold: 1,
          payment_mode: this.payment_mode,
          amount: this.payment_cost,
          amount_paid: this.amount_paid,
          balance,
          creditor_name: this.creditor_name,
          content: JSON.stringify(this.prod.content)
        }

        this.saleOrder(data3);
        this.amount_paid = 0;
      } else if(this.payment_mode === 'mpesa'){
        this.amount_paid = 0;
        this.saleOrder(data4);
      } else if(this.payment_mode === 'card'){
        this.amount_paid = 0;
        this.saleOrder(data4);
      } else {
        this.amount_paid = 0;
        this.saleOrder(data4);
      }
    },

    saleOrder(data7){
      this.$axios.post(`/sales`, data7).then(response => {
        //Remove from ready data
        this.$toast.success('Payment record sent to cashier', {
              duration:  2000
            })
        let table_index = this.data.indexOf(this.prod)
        let id = this.prod.id;
        this.sheet1 = false
            // Remove from ready table database
            this.$axios.delete(`/readies/${id}`).then(()=>{
              socket.emit('removeFromReadyData', table_index)
              this.data.splice(table_index, 1)
            })
        })
        .catch(error => {
          console.log(error)
        })
    },

    sendReadyToSaleBill(){
      let data10 = {
          user_order: this.prod.user_name,
          user_id: this.loggedInUser.data.id,
          sold: 1,
          payment_mode: this.payment_mode,
          amount: this.payment_cost,
          amount_paid: this.payment_cost,
          balance: 0,
          creditor_name: this.creditor_name,
          content: JSON.stringify(this.prod.content)
        }

        if(this.payment_mode === 'cash'){
        let balance = 0;
        if(this.amount_paid > 0){
          balance = this.amount_paid - this.payment_cost;
        } else if(this.amount_paid === this.payment_cost){
          balance = 0
        }

        let data3 = {
          user_order: this.prod.user_name,
          user_id: this.loggedInUser.data.id,
          sold: 1,
          payment_mode: this.payment_mode,
          amount: this.payment_cost,
          amount_paid: this.amount_paid,
          balance,
          creditor_name: this.creditor_name,
          content: JSON.stringify(this.prod.content)
        }

        this.saleOrderBill(data3);
        this.amount_paid = 0;
      } else if(this.payment_mode === 'mpesa'){
        this.amount_paid = 0;
        this.saleOrderBill(data10);
      } else if(this.payment_mode === 'card'){
        this.amount_paid = 0;
        this.saleOrderBill(data10);
      } else {
        this.amount_paid = 0;
        this.saleOrderBill(data10);
      }
    },

    saleOrderBill(data7){
      this.$axios.post(`/sales`, data7).then(response => {
        //Remove from ready data
        this.$toast.success('Payment record sent to cashier', {
            duration:  2000
        })

        let table_index = this.bills.indexOf(this.prod)
        let id = this.prod.id;

        this.sheet1 = false
        //socket.emit('sendToSales', response.data.data)

        // Remove from ready table database
        this.$axios.delete(`/bills/${id}`).then(()=>{
           socket.emit('removeFromReadyData', table_index)
           this.bills.splice(table_index, 1)
          })
        })
        .catch(error => {
          console.log(error)
        })
    },

    voidSingleItem(product, item, index){
      this.voidSingleItemDialog = true;
      this.single_table_item_name = item.name;
      this.single_table_item_product = product;
      this.single_table_item_index = index;
    },

    deleteSingleItem(){
      this.voidSingleItemDialog = false;
      let product = this.single_table_item_product;

      let deleted_content = product.content[this.single_table_item_index];
      product.content.splice(this.single_table_item_index, 1);

      let total_sum = 0;
      if(product.content.length > 0){
        let cost = []
        product.content.forEach(val => {
          cost.push(val.selling_price)
        })
        total_sum = cost.reduce((a, b)=>{
          return a + b;
        })
      }

      product.amount = total_sum;
      let new_content = []
      new_content.push(deleted_content)

      let data = {
        user_id: this.loggedInUser.data.id,
        sold: 0,
        amount: total_sum,
        freaze: 0,
        sold: 0,
        split: 0,
        merged: 0,
        user_order: product.user_name,
        table_name: product.table,
        content: JSON.stringify(product.content)
      };

      this.$axios.patch(`/readies/${product.id}`, data).then(res => {
        socket.emit('single_item_deleted_ready', res.data.data);
        this.$toast.success(`${this.single_table_item_name} has been deleted from ${product.table}.`,
        { duration: 1000 });

        let new_data = {
          sold: 0,
          id: product.id,
          user_name: product.user_name,
          time: product.time,
          amount: deleted_content.selling_price,
          table: product.table,
          content: new_content
        }

        let data1 = {
          user_requesting_void: this.user_requesting_void,
          module: `${this.single_table_item_name} has been deleted from ready.`,
          content: JSON.stringify(new_data),
          user_id: this.loggedInUser.data.id,
          cancel_id: this.void_id
        }

        this.$axios.post('/loggers', data1).then()
          .catch(err => console.log(err));
      }).catch(err => {console.log(err)})

    },

    printBillTable(bill, cost){
      let printJSONdata = []
      bill.content.forEach(val => {
        let data = {
          QTY: val.qty,
          ITEM: val.name,
          AMOUNT1: val.selling_price
        }

        printJSONdata.push(data)
      })

      printJSONdata.Total = cost;

      printJS({
        printable: printJSONdata,
        type: 'json',
        properties: ['QTY', 'ITEM', 'AMOUNT1'],
        documentTitle: 'Receipt',
        header: `<div style="text-align: center; line-height: 1.1;">
            <h5>RECEIPT</h5>
            <p>TANAGER RESTAURANT<br>P.O BOX 13874-00100 Nairobi</p>
            <p>CELL: 0792731214 <br> 0792731214</p>
            <p>TILL No: 5348859<br>PIN No: P051114506J</p>
          </div><hr>

          <div style="text-align: center; margin-bottom: 4%;">
            <p>Waiter : ${bill.user_name}<br>Table : ${bill.table}<br>
            Date and Time : ${moment().format('MMMM Do YYYY h:m a')}</p><hr>

            <div>Total : Ksh ${cost - ((cost*0.14) + (cost*0.02)).toFixed(2)}</div>
            <div>(14% VAT) : ${(cost*0.14).toFixed(2)}</div>
            <div>(2% CTL) : ${(cost*0.02).toFixed(2)}</div>
            <div><h3>Sub Total : Ksh ${cost}</h3></div>
            <div>Price Inclusive of VAT</div>
          </div>

          <div>
          </div>`,
          gridHeaderStyle: 'font-weight: bold; border-top: 2px solid; border-bottom: 2px solid;',
          gridStyle: 'border-bottom: 1px solid lightgray; margin-bottom: -1px; text-align: center; border-collapse: collapse;'        // style: '.custom-h3 { color: red; }'
      })
    }

  }
}
</script>

<style scoped>

.primaryy {
  background: #006064;
}

.testReset {
  margin: 0px !important;
  padding: 0px !important;
}

</style>
